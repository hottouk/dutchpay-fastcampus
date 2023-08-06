import { render, screen } from "@testing-library/react"
import { RecoilRoot } from "recoil"
import AddMembers from "./AddMembers"
import userEvent from "@testing-library/user-event"

const renderComponent = () => {
  render(
    <RecoilRoot>
      <AddMembers />
    </RecoilRoot>
  )
  const input = screen.getByTestId("input-member-names")
  const saveBtn = screen.getByText("저장")
  return {
    input, saveBtn
  }
}

describe("그룹 멤버 추가 페이지", () => {

  test('그룹 멤버 입력 컴포넌트가 랜더링 되었는가?', () => {
    const { input, saveBtn } = renderComponent()
    expect(input).not.toBeNull()
    expect(saveBtn).not.toBeNull()
  })

  test('그룹 멤버를 입력하지 않고 "저장 버튼 클릭 시, 에러 메세지를 노출한다.', async () => {
    const { saveBtn } = renderComponent()

    await userEvent.click(saveBtn)

    const errorMessage = await screen.findByText('그룹 멤버들의 이름을 입력해 주세요.') //findByText는 promise 반환; 일정 시간 후에 text를 검색하여 나타난 메세지를 반환한다.
    expect(errorMessage).toBeInTheDocument()
  })

  test('그룹 멤버를 입력 후, "저장 버튼을 클릭 시, 저장 성공', async () => {
    const { input, saveBtn } = renderComponent()

    await userEvent.type(input, '철수 영희 영수')
    await userEvent.click(saveBtn)

    const errorMessage = screen.queryByText('그룹 멤버들의 이름을 입력해 주세요.')
    expect(errorMessage).toBeNull()
  })

})
