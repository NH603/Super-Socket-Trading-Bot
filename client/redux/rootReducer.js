import { combineReducers } from 'redux'
import user from './modules/user'
import binance from './modules/binance'
import loginLocal from './modules/loginLocal'
import signupLocal from './modules/signupLocal'
import flashMessage from './modules/flashMessage'

export default combineReducers({
  user,
  loginLocal,
  signupLocal,
  flashMessage,
  binance
})
