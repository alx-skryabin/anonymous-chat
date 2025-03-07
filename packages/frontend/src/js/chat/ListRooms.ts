import {Socket} from 'socket.io-client'
import {EVENT} from './config'
import {getNameRoom} from './utils'
import {Chat} from './Chat' // Импортируем Chat для типизации

// Интерфейс для данных комнаты
interface Room {
  name: string
  password?: string
}

export class ListRooms {
  private socket: Socket
  private chat: Chat

  constructor(chat: Chat, socket: Socket) {
    this.socket = socket
    this.chat = chat
    this.prepare()
  }

  private prepare(): void {
    this.setEventSocket()
    this.setEventOpen()
  }

  private setEventOpen(): void {
    this.chat.modals.listRoom.options.onOpenStart = () => {
      this.socket.emit(EVENT.GET_ROOMS)
    }
  }

  private setEventSocket(): void {
    const $list = this.chat.modals.listRoom.el.querySelector('.list-rooms') as HTMLElement

    this.socket.on(EVENT.GET_ROOMS, (data: {rooms: Room[]}) => {
      $list.innerHTML = ''
      data.rooms.forEach(room => {
        const $item = this.createElItem(room.name)
        $item.innerHTML = this.toHTMLitem(room)
        $list.append($item)
      })
    })
  }

  private createElItem(room: string): HTMLElement {
    const $item = document.createElement('div')
    $item.classList.add('list-rooms-item')
    const currentRoom = getNameRoom() || 'free'
    if (currentRoom === room) $item.classList.add('active')
    return $item
  }

  private toHTMLitem(data: Room): string {
    const {name, password} = data
    const access = password ? 'Private' : 'Public'
    const accessIcon = `<i class="fas ${password ? 'fa-lock' : 'fa-lock-open'}"></i>`
    const uri = this.defineUriRoom(name)
    const passRoom = this.chat.isRoot
      ? `<div><i class="fas fa-key"></i> <span>Pass:</span> <strong>${password || '—'}</strong></div>`
      : ''

    return `
      <div><i class="fas fa-couch"></i> <span>Room:</span> <strong>${name}</strong></div>
      <div>${accessIcon} <span>Access:</span> <strong>${access}</strong></div>
      <div><i class="fas fa-external-link-square-alt"></i> <span>Link:</span> <a href="${uri}">GO</a></div>
      ${passRoom}
    `
  }

  private defineUriRoom(room: string): string {
    if (room === 'free') return window.location.origin
    return `${window.location.origin}/?room=${room}`
  }
}
