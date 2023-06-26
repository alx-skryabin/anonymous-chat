const URIlocal = 'http://localhost:3000'
// const URIprod = 'https://chat-noname.herokuapp.com'
const URIprod = 'https://anonymous-chat-weld.vercel.app'

const EVENT = {
  CHAT_MSG: 'CHAT_MSG',
  EDIT_MSG: 'EDIT_MSG',
  DELETE_MSG: 'DELETE_MSG',
  CHAT_NEW_USER: 'CHAT_NEW_USER',
  CHAT_LEAVE_USER: 'CHAT_LEAVE_USER',
  CHANGE_AVATAR: 'CHANGE_AVATAR',
  CREATE_ROOM: 'CREATE_ROOM',
  SIGN_IN_ROOM: 'SIGN_IN_ROOM',
  GET_ROOMS: 'GET_ROOMS',
  GET_USERS: 'GET_USERS',
  VOTING_INIT: 'VOTING_INIT',
  VOTING_POINT: 'VOTING_POINT',
  VOTING_RESULT: 'VOTING_RESULT',
  VOTING_FINISH: 'VOTING_FINISH',
  TURN_ROOT: 'TURN_ROOT',
}

export {URIlocal, URIprod, EVENT}
