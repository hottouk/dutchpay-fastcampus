import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { useSetRecoilState } from "recoil";
import { groupNameState } from "../state/groupName";
import { groupMembersState } from "../state/groupMembers";
import { expnesesState } from "../state/expenses";
import { groupIdState } from "../state/groupId";


export const useGroupData = () => {
  const guid = useParams().guid
  const setGroupName = useSetRecoilState(groupNameState)
  const setGroupMembers = useSetRecoilState(groupMembersState)
  const setExpenses = useSetRecoilState(expnesesState)
  const setGroupId = useSetRecoilState(groupIdState)

  const fetchAndSetGroupData = () => {
    API.get('groupsApi', '/groups/' + guid)
      .then(({data}) => {
        console.log('UseGROUPDATA--->', data)
        //공통 모듈이기에 데이타 전부 필요하다.
        setGroupName(data.groupName)
        setGroupId(data.guid)
        setGroupMembers(data.members)
        setExpenses(data.expenses||[]) //빈 배열을 주는 이유: members에서 사용 시 expenses는 입력되지 않는데, 그럴 경우 undefined가 되어 합을 구할 수 없다.
      })
      .catch((error) => {
        alert("서버에서 데이터를 불러오는데 실패했습니다.")
      });
  }

  //guid값이 바뀔 때마다 and 랜더링 마다 콜백함수 실행한다.
  useEffect(() => {
    if (guid?.length > 0) {
      fetchAndSetGroupData();
    }
  }, [guid]);
}