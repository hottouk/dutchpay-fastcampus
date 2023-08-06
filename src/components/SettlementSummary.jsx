import React, { useRef } from 'react'
import { expnesesState } from '../state/expenses'
import { useRecoilValue } from 'recoil'
import { groupMembersState } from '../state/groupMembers'
import { styled } from 'styled-components'
import { StyledTitle } from './AddExpenseForm'
import { Button } from 'react-bootstrap'
import { toPng } from 'html-to-image'
import { Download } from 'react-bootstrap-icons'

export const calculateMinimumTransaction = (expenses, members, amountPerPerson) => {
  const minimumTransactions = []
  //만약 각각 냈어야 할 돈이 0원, 즉 모두가 제 몫을 냈다면 정산은 없어도 된다. 빈 배열 반환
  if (amountPerPerson === 0) {
    return minimumTransactions
  }
  //1. 사람별로 냈어야 할 금액 
  //1) membersToPay 빈 obj => obj{ 멤버 이름 : 멤버 당 내야할 돈 }
  const membersToPay = {}
  members.forEach(member => {
    //2) membersToPay의 키 값을 멤버의 이름으로 정하고 키 값에 value 넣기
    membersToPay[member] = amountPerPerson
  });
  //2. 사람별로 내고 받아야 할 금액 업데이트, 비용 마다 for문 돌림.
  //1) membersToPay{ 멤버 이름: 멤버 당 추가로 내거나 추가로 받아야할 돈 }
  expenses.forEach(({ payer, amount }) => {
    membersToPay[payer] -= amount
  });
  //3. paidAmount 기준/ 오름차순으로 정렬된 배열 만들기
  //1) Object.keys()함수는 membersToPay라는 Object를 키 값을 요소로 하는 배열로 반환한다.
  //2) 반환된 배열 요소 {멤버:멤버 ,추가로 내거나 받을 돈: 금액}
  //3) 배열 요소를 금액 별로 정렬
  const sortedMembersToPay = Object.keys(membersToPay).map(member => (
    { member: member, amount: membersToPay[member] }
  ))
    .sort((a, b) => a.amount - b.amount)

  //4. index 만들기 Pointer
  var leftReceiver = 0
  var rightSender = sortedMembersToPay.length - 1
  //1) 인덱스의 순서가 교차 되는 순간 while 중지

  while (leftReceiver < rightSender) {
    while (leftReceiver < rightSender && sortedMembersToPay[leftReceiver].amount === 0) {
      leftReceiver++;
    }
    while (leftReceiver < rightSender && sortedMembersToPay[rightSender].amount === 0) {
      rightSender--;
    }
    const receiveInfo = sortedMembersToPay[leftReceiver]
    const sendInfo = sortedMembersToPay[rightSender]
    const amountToReceive = Math.abs(receiveInfo.amount)
    const amountToSend = Math.abs(sendInfo.amount)
    // if문 2)가장 크게 빚진 사람이 보내야 할 금액의 절대값이 
    // 가장 많이 낸 사람이 받아야 할 금액의 절대값보다 큰 경우
    if (amountToSend > amountToReceive) {
      minimumTransactions.push({
        receiver: receiveInfo.member,
        sender: sendInfo.member,
        amount: amountToReceive
      })
      receiveInfo.amount = 0
      sendInfo.amount -= amountToReceive
      leftReceiver++;
    } else { // 3) 가장 크게 빚진 사람이 보내야 할 금액의 절대값이 가장 많이 낸 사람이 받아야 할 금액의 절대값보다 같거나 작은 경우
      minimumTransactions.push({
        receiver: receiveInfo.member,
        sender: sendInfo.member,
        amount: amountToSend
      })
      sendInfo.amount = 0
      receiveInfo.amount += amountToSend
      rightSender--;
    }
  }
  return minimumTransactions
}

const SettlementSummary = () => {
  const wrapperElement = useRef(null)

  //다른 페이지에서 입력되어 저장된 값 불러오기
  const expenses = useRecoilValue(expnesesState)
  const members = useRecoilValue(groupMembersState)

  //전체 지출 금액 합산 로직
  const totalExpenseAmount = parseInt(expenses.reduce((acc, currentExpenseAmount) => acc + parseInt(currentExpenseAmount.amount), 0))
  const groupMembersCount = members.length
  const splitAmount = totalExpenseAmount / groupMembersCount

  //핵심 로직 연습하기
  const minimumTransaction = calculateMinimumTransaction(expenses, members, splitAmount)

  //다운로드 이미지 함수
  const exportToImg = () => {
    if (wrapperElement.current === null) {
      return
    }

    //Promise!반환 convert 끝날때까지 기다려야 하기 때문.
    toPng(wrapperElement.current, {
      filter: (node) => { return node.tagName !== 'BUTTON' }
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'settlement-summary.png'
      link.href = dataUrl;
      link.click()
    })
      .catch((error) => {
        console.error(error)
      })
  }


  return (
    <StyledWrapper ref={wrapperElement}>
      <StyledTitle>2. 정산은 이렇게!</StyledTitle>
      {totalExpenseAmount > 0 && groupMembersCount > 0 && minimumTransaction.length > 0 && (
        <div>
          <StyledSummary>
            <span>{groupMembersCount}명이 총 {totalExpenseAmount}원 지출함.</span>
            <br />
            <span>한 사람 당 {splitAmount}원</span>
          </StyledSummary>
          <StyledUl>
            {minimumTransaction.map(({ receiver, sender, amount }, index) =>
              <li key={`transaction-${index}`}>
                <span>{sender}가 {receiver}에게 {amount}원 보내기</span>
              </li>
            )}
          </StyledUl>
          <StyledBtn data-testid='downloadBtn' onClick={exportToImg}><Download /></StyledBtn>
        </div>
      )}
    </StyledWrapper>
  )
}

const StyledBtn = styled(Button)`
  background: none;
  border: none;
  font-size: 25px;
  position: absolute;
  top: 12px;
  right: 12px;

  &:hover, &:active{
    background-color: #683ba1;
    color: black;
  }
`

const StyledSummary = styled.div`
  margin-top: 31px;
`

const StyledWrapper = styled.div`
  position: relative;
  padding:50px;
  background-color: #683ba1;
  color: #fff;
  box-shadow: 3px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius:15px;
  text-align:center;
  font-size: 18px;
`
const StyledUl = styled.ul`
  margin-top: 31px;
  font-weight: 600;
  line-height: 200%;
  list-style-type: disclosure-closed;
  li::marker{
    animation: blinker 1s linear infinite;
  }
  @keyframes blinker {
    50%{
      opacity: 0
    }
  }
`
export default SettlementSummary