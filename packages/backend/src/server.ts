import express, {Express} from 'express'
import path from 'path'
import {createSocket} from './socket/create-socket'
// import {socketEvent} from './socket/socket.event'

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
    // socketEvent(io, socket)
  })

  return {
    start: () => {
      httpServer.listen(PORT, () => {
        console.log(`Server has been started on port... ${PORT}`)
      })
    }
  }
}
