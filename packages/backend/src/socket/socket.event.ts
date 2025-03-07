import {Server, Socket} from 'socket.io'
import {messageChat} from './message.event'
import {messageService} from './service.event'
import {signInRoom} from './sign-in.event'
import {kick} from './kick.event'

export function socketEvent(io: Server, socket: Socket): void {
  signInRoom(socket)
  messageService(io, socket)
  messageChat(io, socket)
  kick(io, socket)
}
