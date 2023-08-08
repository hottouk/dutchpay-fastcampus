import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { groupMembersState } from '../state/groupMembers'
import { expnesesState } from '../state/expenses'
import styled from 'styled-components'
import { API } from 'aws-amplify'
import { groupIdState } from '../state/groupId'

const AddExpenseForm = () => {
  const groupMembers = useRecoilValue(groupMembersState)
  const today = new Date()
  const [date, setDate] = useState([today.getFullYear(), today.getMonth() + 1, today.getDate()].join('-'))
  const [desc, setdesc] = useState('')
  const [amount, setAmount] = useState(0)
  const [payer, setPayer] = useState(null)
  const [validated, setValidated] = useState(false)
  const [expense, setExpense] = useRecoilState(expnesesState)
  const [isDescValid, setisDescValid] = useState(false)
  const [isAmountValid, setisAmountValid] = useState(false)
  const [isPayerValid, setIsPayerValid] = useState(false)
  const guid = useRecoilValue(groupIdState)

  const saveExpense = (expense) => {
    API.put('groupsApi', `/groups/${guid}/expenses`, {
      body: {
        expense: expense
      }
    }).then(response => {
      setExpense(expenses =>
        [...expenses,
          expense]
      )
    }).catch(error => {
      alert(error)
    });
  }


  const checkFormFValidity = () => {
    setisDescValid(desc.length > 0)
    setIsPayerValid(payer !== null)
    setisAmountValid(amount > 0)
    return desc.length > 0 && payer !== null && amount > 0
  }

  const handleSubmit = (event) => {
    event.preventDefault() // prevent default 에러메세지가 나왔다 바로 사라지는 것 방지!!
    if (checkFormFValidity() === false) {
    } else {
      const newExpense = {
        date,
        desc,
        amount,
        payer,
      }
      saveExpense(newExpense)
    }
    setValidated(true)
  }

  return (
    <StyeldWrapper>
      <Form noValidate onSubmit={handleSubmit}>
        <StyledTitle>1. 비용 추가하기</StyledTitle>

        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type='date'
                value={date}
                onChange={(e) => { setDate(e.target.value) }}
                placeholder='결제한 날짜를 입력하세요.' />
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <StyledFormGroup>
              <Form.Control
                type='text'
                value={desc}
                isValid={isDescValid}
                isInvalid={!isDescValid && validated}
                onChange={({ target }) => setdesc(target.value)}
                placeholder='비용에 대한 설명을 입력하세요.' />
              <Form.Control.Feedback
                type='invalid'
                data-valid={isDescValid}
              >비용 설명을 입력하세요.</Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Control
                isValid={isAmountValid}
                isInvalid={!isAmountValid && validated}
                type='number'
                value={amount}
                onChange={({ target }) => setAmount(target.value)}
                placeholder='비용은 얼마였나요?' />
              <Form.Control.Feedback
                type='invalid'
                data-valid={isAmountValid}
              >금액을 입력하세요.</Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
          <Col xs={12} lg={6}>
            <StyledFormGroup>
              <Form.Select
                isValid={isPayerValid}
                isInvalid={!isPayerValid && validated}
                defaultValue=""
                onChange={(e) => setPayer(e.target.value)}>
                <option disabled value={""}>누가 결제했나요?</option>
                {groupMembers.map(member =>
                  <option key={member} value={member}>{member}</option>)}
              </Form.Select>
              <Form.Control.Feedback
                type='invalid'
                data-valid={isPayerValid}
              >결제자를 선택하세요.</Form.Control.Feedback>
            </StyledFormGroup>
          </Col>
        </Row>

        <Row>
          <Col className='d-gird gap-2'>
            <StyledSubmitBtn type='submit'>추가하기</StyledSubmitBtn>
          </Col>
        </Row>
      </Form>
    </StyeldWrapper>
  )
}

const StyeldWrapper = styled.div`
  padding: 50px;
  background-color: #683BA1;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
`

const StyledFormGroup = styled(Form.Group)`
  margin-bottom: 15px;
  
  input, select {
    background-color: #59359A;
    boxshadow: 3px 0px 4px rgba(0,0,0.25);
    border-radius: 8px;
    border:0;
    color: #f8f9fa;
    height: 45px;

    &:focus {
      color: #f8f9fa;
      background-color: #59359A;
      filter: brightness(80%)
    }

    ::placeholder {
      color: #f8f9fa;
    }
  }
`

const StyledSubmitBtn = styled(Button).attrs({
  type: 'submit'

})`
  width: 100%;
  height: 60px;
  border: 0px;
  border-radius:8px;
  background-color:#E2D9F3;
  color: #59359A;
  padding: 16px 32px;
  gap 8px;

  &:hover, &:focus{
    background-color:#E2D9F3;
    filter: rgba(0,0,0,0.4);
  }
`

export const StyledTitle = styled.h3`
  color: #ffffff;
  text-align:center;
  font-weight: 700;
  font-size:40px;
  line-height: 40px;
  letter-spacing: 0.25px;
  margin-bottom: 15px;

`

export default AddExpenseForm