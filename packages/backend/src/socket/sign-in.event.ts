import {Socket} from 'socket.io'
import {addUser, User} from '../models/users'
import {getRoom, addRoom} from '../models/rooms'

export function signInRoom(socket: Socket): void {
  socket.on(
    'SIGN_IN_ROOM',
    ({room, avatar, isRoot}: {room?: string; avatar: string; isRoot: boolean}) => {
      const roomName = room || 'free'

      const dataRoom = getRoom(roomName)
      if (!dataRoom) {
        return socket.emit('SIGN_IN_ROOM', {
          message: `Room «${roomName}» not found`,
          code: 3
        })
      }

      const {name, password} = dataRoom
      if (password && !isRoot) {
        const user: User = addUser(socket.id, name, avatar)
        socket.join(user.room)

        socket.emit('SIGN_IN_ROOM', {
          message: `Room «${name}» required password`,
          name,
          password,
          code: 2
        })
      } else {
        const user: User = addUser(socket.id, name, avatar, isRoot)
        socket.join(user.room)

        socket.emit('SIGN_IN_ROOM', {
          room: user.room,
          message: 'Sign in room success',
          password,
          code: 1
        })
      }
    }
  )

  socket.on('CREATE_ROOM', (data: {name: string; password: string | false}) => {
    const {name, password} = data
    const dataRoom = getRoom(name)

    if (dataRoom) {
      return socket.emit('CREATE_ROOM', {
        message: `The name «${name}» already exists`,
        code: 2
      })
    }

    addRoom(name, password)
    socket.emit('CREATE_ROOM', {
      message: `Waiting... Going to the room «${name}»`,
      name,
      code: 1
    })
  })
}
