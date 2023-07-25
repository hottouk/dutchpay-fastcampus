import React from 'react'
import CenteredOverlayForm from './CenteredOverlayForm'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { useRecoilState } from 'recoil'
import { useState } from 'react'
import { groupNameState } from "../state/groupName"


const CreateGroups = () => {
  const [groupName, setGroupName] = useRecoilState(groupNameState)
  const [validGroupName, setValidGroupName] = useState(false)
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity()) {
      setValidGroupName(true)
    } else {
      setValidGroupName(false)
      event.stopPropagation()
    }
    setValidated(true)
  }
  
  const handleChange = (event) => {
    setGroupName(event.target.value)
  }

  return (
    <div>
      <h1>Dutch Pay</h1>
      <Container>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <h2>먼저, 더치페이 할 그룹의 이름을 정해볼까?</h2>
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Button type='submit'>
              저장
            </Button>
          </Row>
        </Form>
      </Container>
      <CenteredOverlayForm />
    </div>

  )
}

export default CreateGroups