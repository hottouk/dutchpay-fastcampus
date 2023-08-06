import { atom } from "recoil"

export const expnesesState = atom({
  key: 'expenses',
  default: []
})