import express, {Express} from 'express'
import path from 'path'
import dotenv from 'dotenv'
import {createSocket} from './socket/create-socket'
import {socketEvent} from './socket/socket.event'

// Загружаем переменные окружения в зависимости от NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({path: path.resolve(__dirname, '..', envFile)})

export const createServer = (): {start: () => void} => {
  const app: Express = express()
  const PORT: number = parseInt(process.env.PORT || '5000', 10)

  // Путь к статическому HTML-файлу
  const staticPath = path.join(__dirname, '..', 'public')
  const htmlFile = path.join(staticPath, 'index.html')

  // Обслуживание папки public как статической (если есть другие файлы)
  app.use(express.static(staticPath))

  // Возвращаем server.html по любому маршруту
  app.get('*', (req, res) => {
    res.sendFile(htmlFile)
  })

  // Настройка Socket.IO
  const {httpServer, io} = createSocket(app)

  io.on('connection', socket => {
    console.log('Client connected', socket.id)
    socketEvent(io, socket)
  })

  return {
    start: () => {
      httpServer.listen(PORT, () => {
        console.log(`Started on port... ${PORT}:${process.env.NODE_ENV}`)
      })
    }
  }
}
