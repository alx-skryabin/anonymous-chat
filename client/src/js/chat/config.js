const URIlocal = 'http://localhost:3000'
const URIprod = 'https://node-socket-express.herokuapp.com'
const EVENT = {
  CHAT_MSG: 'CHAT_MSG',
  EDIT_MSG: 'EDIT_MSG',
  DELETE_MSG: 'DELETE_MSG',
  CHAT_NEW_USER: 'CHAT_NEW_USER',
  CHAT_LEAVE_USER: 'CHAT_LEAVE_USER',
  CREATE_ROOM: 'CREATE_ROOM',
  SIGN_IN_ROOM: 'SIGN_IN_ROOM',
  GET_ROOMS: 'GET_ROOMS',
}

export {URIlocal, URIprod, EVENT}
