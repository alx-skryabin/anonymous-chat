const {v4} = require('uuid')
const {getUser} = require('../models/users')

function messageChat(io, socket) {
  socket.on('CHAT_MSG', data => {
    io.in(getUser(socket.id).room).emit('CHAT_MSG', {
      message: data.message,
      userId: data.userId,
      avatar: data.avatar,
      msgRoot: data.msgRoot,
      msgId: v4()
    })
  })

  socket.on('EDIT_MSG', data => {
    io.emit('EDIT_MSG', {
      message: data.message,
      msgId: data.msgId
    })
  })

  socket.on('DELETE_MSG', data => {
    io.emit('DELETE_MSG', {
      msgId: data.msgId
    })
  })
}

module.exports = {messageChat}
