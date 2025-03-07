import {Socket} from 'socket.io'
import {addUser, User} from '../models/users'
import {getRoom, addRoom, Room} from '../models/rooms'
import {EVENTS} from '@anonymous-chat/shared'

export function signInRoom(socket: Socket): void {
  socket.on(
    EVENTS.SIGN_IN_ROOM,
    ({room, avatar, isRoot}: {room?: string; avatar: string; isRoot: boolean}) => {
      const roomName = room || 'free'

      const dataRoom = getRoom(roomName)
      if (!dataRoom) {
        return socket.emit(EVENTS.SIGN_IN_ROOM, {
          message: `Room «${roomName}» not found`,
          code: 3
        })
      }

      const {name, password} = dataRoom
      if (password && !isRoot) {
        const user: User = addUser({
          id: socket.id,
          room: name,
          avatar,
          root: false
        })
        socket.join(user.room)

        socket.emit(EVENTS.SIGN_IN_ROOM, {
          message: `Room «${name}» required password`,
          name,
          password,
          code: 2
        })
      } else {
        const user: User = addUser({
          id: socket.id,
          room: name,
          avatar,
          root: isRoot
        })
        socket.join(user.room)

        socket.emit(EVENTS.SIGN_IN_ROOM, {
          room: user.room,
          message: 'Sign in room success',
          password,
          code: 1
        })
      }
    }
  )

  socket.on(EVENTS.CREATE_ROOM, (data: Room) => {
    const dataRoom = getRoom(data.name)

    if (dataRoom) {
      return socket.emit(EVENTS.CREATE_ROOM, {
        message: `The name «${data.name}» already exists`,
        code: 2
      })
    }

    addRoom(data)
    socket.emit(EVENTS.CREATE_ROOM, {
      message: `Waiting... Going to the room «${data.name}»`,
      name: data.name,
      code: 1
    })
  })
}
