import React from 'react'
import { useRecoilValue } from 'recoil'
import { expnesesState } from '../state/expenses'
import { Table } from 'react-bootstrap'
import OverlayWrapper from './shared/OverlayWrapper'
import { styled } from 'styled-components'

const ExpenseTable = () => {
  const expenses = useRecoilValue(expnesesState)

  return (
    <OverlayWrapper>
      <Table data-testid="expenseList" borderless hover responsive>
        <StyledTHead>
          <tr>
            <th>날짜</th>
            <th>내용</th>
            <th>결제자</th>
            <th>금액</th>
          </tr>
        </StyledTHead>
        <StyledTBody>
          {expenses.map((expense, idx) => (
            <tr key={`expense-${idx}`}>
              <td>{expense.date}</td>
              <td>{expense.desc}</td>
              <td>{expense.payer}</td>
              <td>{parseInt(expense.amount)}원</td>
            </tr>
          ))}
        </StyledTBody>
      </Table>
    </OverlayWrapper>
  )
}


const StyledTHead = styled.thead`
  text-align:center;
  padding: 20px;
  font-weihgt: 700;
  font-size:24px;
  line-height:29px;
  th{ 
    padding: 20px 8px;
    color: #683da6;
  }
`

const StyledTBody = styled.tbody`
td{
  text-weight:400;
  font-size:18px;
  line-height:59px;
  text-align:center;
}
`
export default ExpenseTable