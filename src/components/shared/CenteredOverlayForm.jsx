import React from 'react'
import { Button, Container, Form, Row } from 'react-bootstrap'
import styled from 'styled-components'
import OverlayWrapper from './OverlayWrapper'
import ServiceLogo from './ServiceLogo'

const CenteredOverlayForm = ({ title, children, validated, handleSubmit }) => {
  return (
    <StyledCentralizedContainer>
      <ServiceLogo/>
      <OverlayWrapper>
        <Container>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <StyledRow>
              <Row className='align-item-start'>
                <StyledSubtitle>{title}</StyledSubtitle>
              </Row>
              <Row className='align-item-center'>
                {children}
              </Row>
              <Row className='align-item-end'>
                <StyledBtn>
                  저장
                </StyledBtn>
              </Row>
            </StyledRow>
          </Form>
        </Container>
      </OverlayWrapper>
    </StyledCentralizedContainer>
  )
}

const StyledCentralizedContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;    
  padding: 0px;
  gap: 10px;
  width: 50vw;
  min-height: 100vh;
  @media (max-width:500px){
    width: 80vw;
  }
`

const StyledBtn = styled(Button).attrs({
  type: 'submit'
})`
  background-color: purple;
  border-radius:8px;
  border:none;
  &:hover{
    background-color: purple;
    filter: brightness(80%);
  }
`

const StyledRow = styled(Row)`
  height:50vh;
  align-items: center;
  justify-content: center;
`

const StyledSubtitle = styled.h2`
  text-align: right;
  overflwo-wrap: break-word;
  word-break:keep-all;
  font-weight:700;
  line-height:35px;
`
export default CenteredOverlayForm