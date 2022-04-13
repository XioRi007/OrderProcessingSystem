import {createContext} from 'react'

function noop() {}

export const ChangedContext = createContext({
  changed: true,
  setChanged: noop,
})