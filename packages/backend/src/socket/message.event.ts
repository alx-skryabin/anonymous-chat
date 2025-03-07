import {Server, Socket} from 'socket.io'
import {v4 as uuidv4} from 'uuid'
import {getUser} from '../models/users'

export function messageChat(io: Server, socket: Socket): void {
  socket.on(
    'CHAT_MSG',
    (data: {message: string; userId: number; avatar: string; msgRoot: boolean}) => {
      const user = getUser(socket.id)
      if (!user) {
        socket.emit('CHAT_MSG', {error: 'User not found'})
        return
      }

      io.in(user.room).emit('CHAT_MSG', {
        message: data.message,
        userId: data.userId,
        avatar: data.avatar,
        msgRoot: data.msgRoot,
        msgId: uuidv4()
      })
    }
  )

  socket.on('EDIT_MSG', (data: {message: string; msgId: string}) => {
    io.emit('EDIT_MSG', {
      message: data.message,
      msgId: data.msgId
    })
  })

  socket.on('DELETE_MSG', (data: {msgId: string}) => {
    io.emit('DELETE_MSG', {
      msgId: data.msgId
    })
  })
}
