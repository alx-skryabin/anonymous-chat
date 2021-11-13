const {addUser} = require('../models/users')
const {getRoom, addRoom} = require('../models/rooms')

function signInRoom(socket) {
  socket.on('SIGN_IN_ROOM', ({room, avatar}) => {
    room = room || 'free'

    const dataRoom = getRoom(room)
    if (!dataRoom) {
      return socket.emit('SIGN_IN_ROOM', {
        message: `Room «${room}» not found`,
        code: 3
      })
    }

    let {name, password} = dataRoom
    if (password) {
      const user = addUser(socket.id, name, avatar)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        message: `Room «${name}» required password`,
        name,
        password,
        code: 2
      })
    } else {
      const user = addUser(socket.id, name, avatar)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        room: user.room,
        message: 'Sign in room success',
        code: 1
      })
    }
  })

  socket.on('CREATE_ROOM', data => {
    const {name, password} = data
    const dataRoom = getRoom(name)

    if (dataRoom) {
      return socket.emit('CREATE_ROOM', {
        message: `The name «${name}» already exists`,
        code: 2
      })
    }

    addRoom(name, password)
    socket.emit('CREATE_ROOM', {
      message: `Waiting... Going to the room «${name}»`,
      name,
      code: 1
    })
  })
}

module.exports = {signInRoom}
