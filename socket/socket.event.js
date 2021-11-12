const {messageChat} = require('./message.event')
const {messageService} = require('./service.event')
const {signInRoom} = require('./sign-in.event')

function socketEvent(io, socket) {
  signInRoom(socket)
  messageService(io, socket)
  messageChat(io, socket)
}

module.exports = {socketEvent}
