import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const getName = () => {
  return Cookies.get('name')
}

const setName = (name) => {
  Cookies.set('name', name)
}

const getId = () => {
  return Cookies.get('id')
}

const setId = (id) => {
  Cookies.set('id', id)
}

const getToken = () => {
  return Cookies.get('token')
}

const setToken = (token) => {
  Cookies.set('token', token)
}

export default {
  getName,
  setName,
  getId,
  setId,
  getToken,
  setToken
}


