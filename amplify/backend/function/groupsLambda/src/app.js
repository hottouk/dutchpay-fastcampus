/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const { DynamoDBClient, DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const uuidv1 = require('uuid').v1

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "groups";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const partitionKeyName = "guid";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/groups";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
//  ********************************/

// app.get(path + hashKeyPath, async function (req, res) {
//   const condition = {}
//   condition[partitionKeyName] = {
//     ComparisonOperator: 'EQ'
//   }

//   if (req.apiGateway) { //인증 관련 
//     condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
//   } else {
//     try {
//       condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
//     } catch (err) {
//       res.statusCode = 500;
//       res.json({ error: 'Wrong column type ' + err });
//     }
//   }

//   let queryParams = {
//     TableName: tableName,
//     KeyConditions: condition
//   }

//   try {
//     const data = await ddbDocClient.send(new QueryCommand(queryParams));
//     res.json(data.Items);
//   } catch (err) {
//     res.statusCode = 500;
//     res.json({ error: 'Could not load items: ' + err.message });
//   }
// });

/*****************************************
 * HTTP Get method for get single object 그룹 정보 읽기*
 *****************************************/

app.get(path + hashKeyPath, async function (req, res) {
  let getItemParams = {
    TableName: tableName,
    Key: { [partitionKeyName]: req.params[partitionKeyName] },
  }

  try {
    const data = await ddbDocClient.send(new GetCommand(getItemParams));
    if (data.Item) {
      res.json({ data: data.Item });
    } else {
      res.json(data);
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: 'Could not load items: ' + err.message });
  }
});

/************************************
* HTTP put method for adding expense to a group - 지출 추가 api*
*************************************/
app.put(`${path}${hashKeyPath}/expenses`, async function (req, res) {
  const guid = req.params[partitionKeyName]
  const expense = req.body.expense

  if (expense === undefined || expense === null || !expense.payer || !expense.amount) {
    res.status(404)
    res.json({ err: "Invalid expense object" })
    return
  }

  let updateItemParams = {
    TableName: tableName,
    Key: { [partitionKeyName]: guid },
    UpdateExpression: 'SET expenses = list_append(if_not_exists(expenses, :empty_list), :vals)',
    ExpressionAttributeValues: {
      ':vals': [expense],
      ':empty_list': [],
    }
  }

  try {
    await ddbDocClient.send(new UpdateCommand(updateItemParams));
    res.statusCode = 200;
    res.json({ success: 'put call succeed!', url: req.url, data: updateItemParams })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }


})


/************************************
* HTTP put method for adding memebers to a group - 멤버 추가 api*
*************************************/
//hashKeyPath가 guid 받아온 값
app.put(`${path}${hashKeyPath}/members`, async function (req, res) {
  const guid = req.params[partitionKeyName]
  const members = req.body.members
  console.log(`members===>${members}`)

  let updateItemParams = {
    TableName: tableName,
    Key: { [partitionKeyName]: guid },
    UpdateExpression: 'SET members = :members',
    ExpressionAttributeValues: {
      ':members': members,
    }
  }

  if (members === null || members.length === 0 || members === undefined || !Array.isArray(members)) {
    res.status(404)
    res.json({ err: 'Invalid Members Exception' })
    return
  }

  try {
    await ddbDocClient.send(new UpdateCommand(updateItemParams));
    res.statusCode = 200;
    res.json({ success: 'put call succeed!', url: req.url, data: updateItemParams })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});

/************************************
* HTTP post method for creating a group - 그룹 생성 api *
*************************************/

app.post(path, async function (req, res) {
  const { groupName } = req.body
  const guid = uuidv1()

  if (groupName === null || groupName === undefined || groupName.trim().length === 0) {
    res.statusCode = 400
    res.json({ error: "Invalid group name" })
    return
  }

  let putItemParams = {
    TableName: tableName,
    Item: {
      groupName: groupName,
      guid: guid,
    }
  }

  try {
    await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ data: putItemParams })
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url, body: req.body });
  }
});


/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async function (req, res) {
  const params = {};
  if (req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }

  try {
    let data = await ddbDocClient.send(new DeleteCommand(removeItemParams));
    res.json({ url: req.url, data: data });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err, url: req.url });
  }
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
