import {Express} from 'express'
import {createServer} from 'http'
import {Server, Socket} from 'socket.io'
import {signInRoom} from './sign-in.event'
import {messageService} from './service.event'
import {messageChat} from './message.event'
import {kick} from './kick.event'

export const createSocket = (app: Express) => {
  const httpServer = createServer(app)

  const io = new Server(httpServer, {
    transports: ['websocket'],
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  return {httpServer, io}
}

export function initSocketEvent(io: Server, socket: Socket): void {
  signInRoom(socket)
  messageService(io, socket)
  messageChat(io, socket)
  kick(io, socket)
}
