const {addUser} = require('../models/users')
const {getRoom} = require('../models/rooms')

function signInRoom(socket) {
  socket.on('SIGN_IN_ROOM', ({room}) => {
    room = room || 'free'

    const dataRoom = getRoom(room)
    if (!dataRoom) {
      socket.emit('SIGN_IN_ROOM', {
        message: `Room «${room}» not found`,
        code: 3
      })
      return
    }

    let {name, password} = dataRoom
    if (password) {
      const user = addUser(socket.id, name)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        message: `Room «${name}» required password`,
        name,
        password,
        code: 2
      })
    } else {
      const user = addUser(socket.id, name)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        room: user.room,
        message: 'Sign in room success',
        code: 1
      })
    }
  })
}

module.exports = {signInRoom}
