const {
  getAllRooms,
  deleteRoom
} = require('../models/rooms')
const {
  deleteUser,
  getAllUsers,
  getUsers,
  getUser,
  addUser
} = require('../models/users')
const {v4} = require('uuid')

const TIME_DELETING_ROOM = 60
const ROOT_PASS = '6233'

function checkUserInRoom(room) {
  setTimeout(() => {
    const users = getUsers(room)

    if (!users.length) {
      // delete a room if it is empty for 60 seconds
      deleteRoom(room)
    }
  }, TIME_DELETING_ROOM * 1000)
}

function messageService(io, socket) {
  socket.on("disconnect", () => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
    checkUserInRoom(user.room)

    io.in(user.room).emit('CHAT_LEAVE_USER', {
      message: 'User left the chat',
      countUser: getUsers(user.room).length
    })
  })


  socket.on('CHAT_NEW_USER', data => {
    const user = getUser(socket.id)

    io.in(user.room).emit('CHAT_MSG', {
      message: 'New user is joined',
      userId: data.userId,
      avatar: data.avatar,
      msgId: v4(),
      countUser: getUsers(user.room).length
    })
  })

  socket.on('GET_ROOMS', () => {
    io.in(socket.id).emit('GET_ROOMS', {
      rooms: getAllRooms()
    })
  })

  socket.on('GET_USERS', () => {
    const user = getUser(socket.id)

    io.in(socket.id).emit('GET_USERS', {
      users: getUsers(user.room)
    })
  })

  socket.on('TURN_ROOT', data => {
    const user = getUser(socket.id)
    const identity = data.password.toString() === ROOT_PASS

    if (identity) {
      deleteUser(socket.id)
      addUser(socket.id, user.room, user.avatar, identity)

      io.in(user.room).emit('CHAT_LEAVE_USER', {
        message: 'User left the chat',
        countUser: getUsers(user.room).length
      })
    }

    io.in(socket.id).emit('TURN_ROOT', identity)
  })

  socket.on('CHANGE_AVATAR', avatar => {
    const user = getUser(socket.id)
    deleteUser(socket.id)
    addUser(socket.id, user.room, avatar)
  })

  // for debug
  socket.on('11', () => io.emit('11', getAllRooms()))
  socket.on('22', () => io.emit('22', getAllUsers()))
}

module.exports = {messageService}
