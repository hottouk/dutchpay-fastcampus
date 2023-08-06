import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AddExpenseForm from './AddExpenseForm'
import ExpenseTable from './ExpenseTable'
import { styled } from 'styled-components'
import { useRecoilValue } from 'recoil'
import { groupNameState } from '../state/groupName'
import SettlementSummary from './SettlementSummary'
import ServiceLogo from './shared/ServiceLogo'

const ExpenseMain = () => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={12} sm={8} md={4}>
            <LeftPane />
          </Col>
          <Col>
            <RightPane />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const LeftPane = () => (
  <Container>
    <StyledRow>
      <Row><ServiceLogo /></Row>
      <Row><AddExpenseForm /></Row>
      <Row><SettlementSummary /></Row>
    </StyledRow>
  </Container>
)

const RightPane = () => {
  const groupName = useRecoilValue(groupNameState)
  return (
    <StyledRightContainer>
      <Row>
        <StyledGroupName>{groupName || '그룹 이름'}</StyledGroupName>
      </Row>
      <Row>
        <ExpenseTable />
      </Row>
    </StyledRightContainer>
  )
}

const StyledRow = styled(Row)`
  gap: 5vh;
  padding-top: 100px;
  justify-content: center;

`

const StyledRightContainer = styled(Container)`
  padding: 100px 31px 100px 31px;
`

const StyledGroupName = styled.h2`
  margin-bottom:80px;
  text-align:center;
  font-weight:700;
  font-size: 47px;
`

export default ExpenseMain