import {Server, Socket} from 'socket.io'
import {getUser} from '../models/users'
import {CHAT} from '../configs/chat'
import {EVENTS, User} from '@anonymous-chat/shared'

// Хранилище голосований (Map с типами)
const voting: Map<string, {d: number; l: number}> = new Map()

class KickVoting {
  private user: User
  private io: Server

  constructor(user: User, io: Server) {
    this.user = user
    this.io = io
    this.prepare()
  }

  private prepare(): void {
    voting.set(this.user.room, {d: 0, l: 0})
    this.countdown()
  }

  private countdown(): void {
    setTimeout(() => {
      console.log('end voting: ' + this.user.room)
      this.sendResult()
      voting.delete(this.user.room)
    }, CHAT.TIME_VOTING * 1000)
  }

  private sendResult(): void {
    const result = voting.get(this.user.room)
    if (result) {
      this.io.in(this.user.id).emit(EVENTS.VOTING_FINISH, result)
      this.io.in(this.user.room).emit(EVENTS.VOTING_RESULT, {
        result,
        avatar: this.user.avatar
      })
    }
  }
}

export function kick(io: Server, socket: Socket): void {
  socket.on(EVENTS.VOTING_INIT, ({id}: {id: string}) => {
    const user = getUser(id)
    if (!user) {
      socket.emit(EVENTS.VOTING_INIT, {
        room: null,
        avatar: null,
        allowVoting: false,
        time: CHAT.TIME_VOTING,
        error: 'User not found'
      })
      return
    }

    let allowVoting = false

    if (!voting.has(user.room)) {
      new KickVoting(user, io)
      allowVoting = true
    }

    const recipient = allowVoting ? user.room : socket.id

    io.in(recipient).emit(EVENTS.VOTING_INIT, {
      room: user.room,
      avatar: user.avatar,
      allowVoting,
      time: CHAT.TIME_VOTING
    })
  })

  socket.on(
    EVENTS.VOTING_POINT,
    ({value, room, isRoot}: {value: string; room: string; isRoot: boolean}) => {
      const res = voting.get(room)
      if (!res) return // Защита от undefined

      const {d, l} = res
      const points = isRoot ? 10 : 1

      if (value === 'dislike') res.d = d + points
      if (value === 'like') res.l = l + points

      voting.set(room, res)
    }
  )
}
