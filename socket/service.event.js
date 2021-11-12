const {
  deleteUser,
  getUsers,
  getUser
} = require('../models/users')
const {v4} = require('uuid')

function messageService(io, socket) {
  socket.on("disconnect", () => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
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

  socket.on('11', () => {
    io.emit('11', {
      message: '11',
    })
  })
  socket.on('22', () => {
    io.emit('22', {
      message: '22',
    })
  })
}

module.exports = {messageService}
