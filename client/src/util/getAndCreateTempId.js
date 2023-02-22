import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const getAndCreateTempId = () => {
  let tempId = Cookies.get('tempId')
  if (!tempId) {
    tempId = uuidv4()
    Cookies.set('tempId', tempId)
  }
  return tempId
}

export default getAndCreateTempId;