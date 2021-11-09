const express = require('express')
const cors = require('cors')
const {v4} = require('uuid')
const {addUser, getUsers} = require('./users')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// If mode = 'production', any request send to static builded 'index.html'
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


/***For Express API***/
// Support JSON format on server
app.use(express.json({extended: true}))
// Support CORS
app.use(cors())


/***For Socket***/
const {httpServer, io} = require('./server-socket')(app)

io.on('connection', socket => {
  // // const room = v4()
  // const room = 'myRoom1'
  // socket.join(room)
  // console.log(222, socket.rooms)


  // socket.on('login', room => {
  //   const user = addUser(socket.id, room)
  //   socket.join(user.room)
  //   // socket.in(room).emit('create_room', {title: `'Someone\'s here ${user.name}'`})
  //   io.in(room).emit('create_room', getUsers(room))
  // })


  socket.on("disconnect", () => {
    io.emit('CHAT_LEAVE_USER', {
      message: 'User left the chat',
      countUser: io.engine.clientsCount,
    })
  })

  socket.on('CHAT_MSG', data => {
    // io.to(room).emit('CHAT_MSG', {
    io.emit('CHAT_MSG', {
      message: data.message,
      userId: data.userId,
      avatar: data.avatar,
      msgId: v4()
    })
  })

  socket.on('EDIT_MSG', data => {
    io.emit('EDIT_MSG', {
      message: data.message,
      msgId: data.msgId,
    })
  })

  socket.on('DELETE_MSG', data => {
    io.emit('DELETE_MSG', {
      msgId: data.msgId
    })
  })

  socket.on('CHAT_NEW_USER', data => {
    io.emit('CHAT_MSG', {
      message: 'New user is joined',
      userId: data.userId,
      avatar: data.avatar,
      msgId: v4(),
      countUser: io.engine.clientsCount,
    })
  })
})


const server = () => {
  return {
    start: () => {
      httpServer.listen(PORT, () => {
        console.log(`Server has been started on port... ${PORT}`)
      })
    }
  }
}

module.exports = server
