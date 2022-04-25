import {createContext} from 'react'

function noop() {}

export const ChangedContext = createContext({
  changed: true,
  setChanged: noop,
  notify_success:noop,
  notify_error:noop
})