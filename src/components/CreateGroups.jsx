import React from 'react'
import CenteredOverlayForm from './CenteredOverlayForm'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { useRecoilState } from 'recoil'
import { useState } from 'react'
import { groupNameState } from "../state/groupName"


const CreateGroups = () => {
  return (
    <div>
      <h1>Dutch Pay</h1>
      <CenteredOverlayForm />
    </div>

  )
}

export default CreateGroups