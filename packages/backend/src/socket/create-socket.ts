import {Express} from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

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
