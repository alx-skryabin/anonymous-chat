const {deleteUser} = require('../models/users')
const {getUser} = require('../models/users')
const {v4} = require('uuid')

function messageService(io, socket) {
  socket.on("disconnect", () => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
    io.in(user.room).emit('CHAT_LEAVE_USER', {
      message: 'User left the chat',
      countUser: io.engine.clientsCount,
    })
  })


  socket.on('CHAT_NEW_USER', data => {
    io.in(getUser(socket.id).room).emit('CHAT_MSG', {
      message: 'New user is joined',
      userId: data.userId,
      avatar: data.avatar,
      msgId: v4(),
      countUser: io.engine.clientsCount,
    })
  })
}

module.exports = {messageService}
