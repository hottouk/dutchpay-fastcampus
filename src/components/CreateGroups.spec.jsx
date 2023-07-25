import { render, screen } from '@testing-library/react'
import CreateGroups from './CreateGroups'
import userEvent from "@testing-library/user-event"

const renderComponent = () => {
  render(<CreateGroups />)

  const input = screen.getByPlaceholderText('2022 제주도 여행')
  const saveBtn = screen.getByText('저장')
  const errorMessage = screen.queryByText('그룹 이름을 입력해 주세요')

  return { input, saveBtn, errorMessage }
}

describe('그룹 생성 페이지', () => {
  test('그룹 이름 입력 컴포넌트가 랜더링 되었는가?', () => {
    const { input, saveBtn } = renderComponent()

    expect(input).notTobeNull()
    expect(saveBtn).notTobeNull()
  })

  test('그룹 이름을 입력하지 않고 저장버튼 클릭 시, 에러 메세지 발생', async () => {
    const { saveBtn, errorMessage } = renderComponent()

    await userEvent.click(saveBtn)
    expect(errorMessage).notTobeNull()
  })

  test('그룹 이름을 입력 후, 저장 버튼 클릭 시, 저장 성공', async () => {
    const { saveBtn, input, errorMessage } = renderComponent()

    await userEvent.type(input, '예시 그룹명')
    await userEvent.click(saveBtn)
    expect(errorMessage).tobeNull()
  })
})