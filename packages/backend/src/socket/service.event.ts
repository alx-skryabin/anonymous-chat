import {Server, Socket} from 'socket.io'
import {v4 as uuidv4} from 'uuid'
import {getAllRooms, deleteRoom} from '../models/rooms'
import {deleteUser, getAllUsers, getUsers, getUser, addUser} from '../models/users'

// Константы
const TIME_DELETING_ROOM: number = 60
const ROOT_PASS: string = '6233'

function checkUserInRoom(room: string): void {
  setTimeout(() => {
    const users = getUsers(room)

    if (!users.length) {
      // Удаляем комнату, если она пуста в течение 60 секунд
      deleteRoom(room)
    }
  }, TIME_DELETING_ROOM * 1000)
}

export function messageService(io: Server, socket: Socket): void {
  socket.on('disconnect', () => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
    checkUserInRoom(user.room)

    if (user.root) return

    io.in(user.room).emit('CHAT_LEAVE_USER', {
      message: 'User left the chat',
      countUser: getUsers(user.room).length
    })
  })

  socket.on('CHAT_NEW_USER', (data: {userId: number}) => {
    const user = getUser(socket.id)
    if (!user) return

    io.in(user.room).emit('CHAT_MSG', {
      message: 'New user is joined',
      userId: data.userId,
      avatar: user.avatar,
      msgId: uuidv4(),
      countUser: getUsers(user.room).length
    })
  })

  socket.on('GET_ROOMS', () => {
    io.in(socket.id).emit('GET_ROOMS', {
      rooms: getAllRooms()
    })
  })

  socket.on('GET_USERS', () => {
    const user = getUser(socket.id)
    if (!user) return

    io.in(socket.id).emit('GET_USERS', {
      users: getUsers(user.room)
    })
  })

  socket.on('TURN_ROOT', (data: {userId: number; password: string}) => {
    const currentUser = getUser(socket.id)
    if (!currentUser) return

    const {room, avatar, root} = currentUser
    const identity = data.password.toString() === ROOT_PASS

    if (identity) {
      deleteUser(socket.id)
      addUser(socket.id, room, avatar, !root)

      if (root) {
        // Отключение root
        io.in(room).emit('CHAT_MSG', {
          message: 'New user is joined',
          userId: data.userId,
          avatar: avatar,
          msgId: uuidv4(),
          countUser: getUsers(room).length
        })
      } else {
        // Включение root
        io.in(room).emit('CHAT_LEAVE_USER', {
          message: 'User left the chat',
          countUser: getUsers(room).length
        })
      }
    }

    io.in(socket.id).emit('TURN_ROOT', {
      root: !root,
      identity
    })
  })

  socket.on('CHANGE_AVATAR', (avatar: string) => {
    const user = getUser(socket.id)
    if (!user) return

    deleteUser(socket.id)
    addUser(socket.id, user.room, avatar, user.root)
  })

  // Для отладки
  socket.on('11', () => io.emit('11', getAllRooms()))
  socket.on('22', () => io.emit('22', getAllUsers()))
}
