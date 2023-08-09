import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AddExpenseForm from './AddExpenseForm'
import ExpenseTable from './ExpenseTable'
import { styled } from 'styled-components'
import { useRecoilValue } from 'recoil'
import { groupNameState } from '../state/groupName'
import SettlementSummary from './SettlementSummary'
import ServiceLogo from './shared/ServiceLogo'
import { useGroupData } from '../hooks/useGroupData'
import { ShareFill } from 'react-bootstrap-icons'

const ExpenseMain = () => {
  useGroupData()

  const handleSharing = () => {
    //1. 모바일인지 데탑인지 구분
    if (navigator.userAgent.match(/Android|iPhone/i) && navigator.share) {
      //3-1. navigator.share 다이얼로그
      navigator.share({
        url: window.location.href
      })
    } else {
      //3-2. navigator.clipboard.writeText
      navigator.clipboard.writeText(
        window.location.href
      ).then(() => {
        alert('공유 링크가 클립보드에 복사 되었습니다. 그룹 멤버들과 공유해 보세요')
      })
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12} sm={8} md={4}>
          <LeftPane />
        </Col>
        <Col>
          <RightPane />
        </Col>
      </Row>
      <StyledShareBtn data-testId="share-btn" onClick={handleSharing}><ShareFill/></StyledShareBtn>
    </Container>
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


const StyledShareBtn = styled.div`
  border-radius:50%;
  background-color: black;
  position: fixed;
  width: 55px;
  height: 55px;
  right: 40px;
  bottom: 45px;
  filter: dropshadow(4px 4px 6px rgba(0, 0, 0, 0.25));
  background-color: #6b3da6;
  color:white;
  text-align: center;
  font-size: 30px;
`

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