
import { render, screen } from "@testing-library/react"
import ExpenseMain from "./ExpenseMain"
import { RecoilRoot } from "recoil"
import userEvent from "@testing-library/user-event"
import { groupMembersState } from "../state/groupMembers"
import { within } from "@testing-library/react"

const renderComponent = () => {
  render(
    <RecoilRoot initializeState={(snap) => {
      snap.set(groupMembersState, ['영수', '영희'])
    }}>
      <ExpenseMain />
    </RecoilRoot>)

  const dateInput = screen.getByPlaceholderText(/결제한 날짜/i)
  const descInput = screen.getByPlaceholderText(/비용에 대한 설명/i)
  const amountInput = screen.getByPlaceholderText(/비용은 얼마/i)
  const payerInput = screen.getByDisplayValue(/누가 결제/i)
  const addBtn = screen.getByText('추가하기')

  const descErrorMesg = screen.getByText('비용 설명을 입력하세요.') //getby는 실행 당시 domtree에 존재해야 함.
  const payerErrorMesg = screen.getByText('결제자를 선택하세요.')
  const amountErrorMesg = screen.getByText('금액을 입력하세요.')


  //정규표현식 /i 는 대소문자 구분 안함
  return {
    dateInput, descInput, amountInput, payerInput, addBtn, descErrorMesg, payerErrorMesg, amountErrorMesg, amountErrorMesg
  }
}

describe('비용 정산 메인 페이지', () => {
  describe('비용 추가 컴포넌트', () => {
    test('비용 추가 컴포넌트 랜더링되는가?', () => {
      const { dateInput, descInput, amountInput, payerInput, addBtn } = renderComponent()

      expect(dateInput).toBeInTheDocument()
      expect(descInput).toBeInTheDocument()
      expect(amountInput).toBeInTheDocument()
      expect(payerInput).toBeInTheDocument()
      expect(addBtn).toBeInTheDocument()
    })

    test('필수 입력 값 미입력 시, 에러 메세지 생성', async () => {
      const { addBtn, descErrorMesg, amountErrorMesg, payerErrorMesg } = renderComponent()
      await userEvent.click(addBtn)

      expect(descErrorMesg).toHaveAttribute('data-valid', 'false')
      expect(payerErrorMesg).toHaveAttribute('data-valid', 'false')
      expect(amountErrorMesg).toHaveAttribute('data-valid', 'false')
    })

    test('필수 값들 입력 후 저장 버튼 클릭 시, 저장에 성공', async () => {
      const { descInput, amountInput, payerInput, addBtn } = renderComponent()

      await userEvent.type(descInput, '장보기')
      await userEvent.type(amountInput, '30,000')
      await userEvent.selectOptions(payerInput, '영수') //test 전 selector 값을 채워 넣어야 함.
      await userEvent.click(addBtn)

      const descErrorMesg = screen.queryByText('비용 설명을 입력하세요.')
      const payerErrorMesg = screen.queryByText('결제자를 선택하세요.')
      const amountErrorMesg = screen.queryByText('금액을 입력하세요.')

      expect(descErrorMesg).toHaveAttribute('data-valid', 'true')
      expect(payerErrorMesg).toHaveAttribute('data-valid', 'true')
      expect(amountErrorMesg).toHaveAttribute('data-valid', 'true')
    })
  })

  describe('비용 리스트 컴포넌트', function () {
    test('비용 리스트 컴포넌트가 랜더링 되는가?', function () {
      renderComponent()
      const expenseListComponent = screen.getByTestId('expenseList')
      expect(expenseListComponent).toBeInTheDocument()
    })

  });

  describe('정산 결과 컴포넌트', function () {
    test('정산 결과 컴포넌트가 랜더링 되는가?', () => {
      renderComponent()
      const component = screen.getByText(/정산은 이렇게/i)
      expect(component).toBeInTheDocument()
    })
  })

  describe('새로운 비용이 입력 되었을 때', function () {
    //컴포넌트 랜더링 후, 새로운 비용을 사용자가 입력하는 과정 
    const addNewExpense = async function () {
      const { dateInput, descInput, amountInput, payerInput, addBtn } = renderComponent()
      await userEvent.type(dateInput, '2023-08-04')
      await userEvent.type(descInput, '장보기')
      await userEvent.type(amountInput, '3000')
      await userEvent.selectOptions(payerInput, '영수')
      await userEvent.click(addBtn)
    }

    beforeEach(async () => {
      await addNewExpense()
    })

    test('날짜, 비용, 결제자, 금액 데이터가 정산 리스트에 추가되는가?', function () {
      const expenseListComponent = screen.getByTestId('expenseList')
      const dateValue = within(expenseListComponent).getByText('2023-08-04')
      expect(dateValue).toBeInTheDocument()

      const descValue = within(expenseListComponent).getByText('장보기')
      expect(descValue).toBeInTheDocument()

      const amountValue = within(expenseListComponent).getByText('3000원')
      expect(amountValue).toBeInTheDocument()

      const payerValue = within(expenseListComponent).getByText('영수')
      expect(payerValue).toBeInTheDocument()
    })

    test('정산 결과 또한 업데이트가 된다.', function () {
      const totalText = screen.getByText(/2명이 총 3000원 지출/i)
      expect(totalText).toBeInTheDocument()

      const transactionText = screen.getByText(/영희가 영수에게 1500원/i)
      expect(transactionText).toBeInTheDocument()
    })

    const htmlToPng = require('html-to-image')

    test('정산 결과를 이미지 파일로 저장할 수 있다.', async () => {
      const spyiedToPng = jest.spyOn(htmlToPng, 'toPng')
      const downloadBtn = screen.getByTestId("downloadBtn")
      expect(downloadBtn).toBeInTheDocument()

      await userEvent.click(downloadBtn)
      expect(spyiedToPng).toHaveBeenCalledTimes(1)
    })

    afterEach(function () {
      jest.resetAllMocks()
    })

  })
})


