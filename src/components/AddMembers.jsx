import React from 'react'
import CenteredOverlayForm from './shared/CenteredOverlayForm'
import { InputTags } from "react-bootstrap-tagsinput"
import { useRecoilState, useRecoilValue } from 'recoil'
import { groupMembersState } from '../state/groupMembers'
import { useState } from 'react'
import { groupNameState } from '../state/groupName'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes'

const AddMembers = () => {
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState)
  const groupName = useRecoilValue(groupNameState)
  const [validated, setvalidated] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    setvalidated(true)
    if(groupMembers.length>0){
      navigate(ROUTES.EXPENSE_MAIN)
    }
  }
  
  
  const title = `더치페이 할 ${groupName} 멤버의 이름을 모두 적어줄래?`
  return (
    <CenteredOverlayForm
      title={title}
      validated={validated}
      handleSubmit={handleSubmit} >
      <InputTags
        data-testid="input-member-names"
        placeholder='이름 간 스페이스바를 눌러주세요'
        onTags={
          (value) => {
            setGroupMembers(value.values) //비동기임.
            console.log(groupMembers)
          }
        }>
      </InputTags>
      {validated && groupMembers.length === 0 && (
      <StyeldErrorMessage>그룹 멤버들의 이름을 입력해 주세요.</StyeldErrorMessage>)}
    </CenteredOverlayForm>
  )
}

const StyeldErrorMessage = styled.span`
  color:red;
  font-size:12px;
`


export default AddMembers