import {Express} from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

export const createSocket = (app: Express) => {
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    transports: ['websocket'],
    cors: {
      origin: ['http://localhost:3000', 'https://bank-just.web.app'], // todo remote поменять
      methods: ['GET', 'POST']
    }
  })

  return {httpServer, io}
}
