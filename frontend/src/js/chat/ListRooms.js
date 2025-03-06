import {EVENT} from './config'
import {getNameRoom} from './utils'

export class ListRooms {
  constructor(chat, socket) {
    this.socket = socket
    this.chat = chat
    this.prepare()
  }

  prepare() {
    this.setEventSocket()
    this.setEventOpen()
  }

  setEventOpen() {
    this.chat.modals.listRoom.options.onOpenStart = () => {
      this.socket.emit(EVENT.GET_ROOMS)
    }
  }

  setEventSocket() {
    const $list = this.chat.modals.listRoom.el.querySelector('.list-rooms')

    this.socket.on(EVENT.GET_ROOMS, data => {
      $list.innerHTML = ''
      data.rooms.map(room => {
        const $item = this.createElItem(room.name)
        $item.innerHTML = this.toHTMLitem(room)
        $list.append($item)
      })
    })
  }

  createElItem(room) {
    const $item = document.createElement('div')
    $item.classList.add('list-rooms-item')
    const currentRoom = getNameRoom() || 'free'
    if (currentRoom === room) $item.classList.add('active')
    return $item
  }

  toHTMLitem(data) {
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

  defineUriRoom(room) {
    if (room === 'free') return window.location.origin
    return `${window.location.origin}/?room=${room}`
  }
}
