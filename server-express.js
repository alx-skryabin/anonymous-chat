const express = require('express')
const cors = require('cors')
const {v4} = require('uuid')
const path = require('path')
const {
  addUser,
  getUser,
  getUsers,
  getAllUsers,
  deleteUser
} = require('./users')
const {
  getRoom
} = require('./rooms')

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

  socket.on('SIGN_IN_ROOM', ({room}) => {
    room = room || 'common'

    const dataRoom = getRoom(room)
    if (!dataRoom) {
      socket.emit('SIGN_IN_ROOM', {
        message: `Room «${room}» not found`,
        code: 3
      })
      return
    }

    let {name, password} = dataRoom
    if (password) {
      const user = addUser(socket.id, name)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        message: `Room «${name}» required password`,
        name,
        password,
        code: 2
      })
    } else {
      const user = addUser(socket.id, name)
      socket.join(user.room)

      socket.emit('SIGN_IN_ROOM', {
        room: user.room,
        message: 'Sign in room success',
        code: 1
      })
    }
  })

  socket.on("disconnect", () => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
    io.in(user.room).emit('CHAT_LEAVE_USER', {
      message: 'User left the chat',
      countUser: io.engine.clientsCount,
    })
  })

  socket.on('CHAT_MSG', data => {
    io.in(getUser(socket.id).room).emit('CHAT_MSG', {
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
    io.in(getUser(socket.id).room).emit('CHAT_MSG', {
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
