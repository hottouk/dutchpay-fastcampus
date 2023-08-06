import React from 'react'
import CenteredOverlayForm from './shared/CenteredOverlayForm'
import { Form } from 'react-bootstrap'
import { useSetRecoilState } from 'recoil'
import { useState } from 'react'
import { groupNameState } from "../state/groupName"
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes'

const CreateGroups = () => {
  const setGroupName = useSetRecoilState(groupNameState)
  const [validGroupName, setValidGroupName] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()
  
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity()) {
      setValidGroupName(true)
      navigate(ROUTES.ADD_MEMBERS)
    } else {
      setValidGroupName(false)
      event.stopPropagation()
    }
    setValidated(true)
  }
  const handleChange = (event) => {
    setGroupName(event.target.value)
  }
  const title = "먼저, 더치페이 할 그룹의 이름을 정해볼까?"

  return (
    <CenteredOverlayForm
      title={title}
      validated={validated}
      handleSubmit={handleSubmit}>
      <Form.Group controlId='validationGroupName'>
        <Form.Control
          type='text'
          required
          placeholder='2022 제주도 여행'
          onChange={handleChange} />
        <Form.Control.Feedback
          type='invalid'
          data-valid={validGroupName}
        >
          그룹 이름을 입력해 주세요.
        </Form.Control.Feedback>
      </Form.Group>
    </CenteredOverlayForm>
  )
}

export default CreateGroups