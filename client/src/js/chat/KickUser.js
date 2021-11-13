import {EVENT} from './config'

export class KickUser {
  constructor(socket, modals) {
    this.socket = socket
    this.modals = modals
    this.$list = this.modals.userKick.el.querySelector('.list-users')
    this.prepare()
  }

  prepare() {
    this.setEventSocket()
    this.setEventOpen()
    this.setEventKick()
  }

  setEventOpen() {
    this.modals.userKick.options.onOpenStart = () => {
      this.socket.emit(EVENT.GET_USERS)
    }
  }

  setEventKick() {
    this.$list.addEventListener('click', e => {
      if (e.target.dataset.action === 'kick') {
        console.log(e.target.dataset.id)
      }
    })
  }

  setEventSocket() {
    this.socket.on(EVENT.GET_USERS, data => {
      this.$list.innerHTML = ''

      data.users.map(user => {
        const $item = this.createElItem(user)
        this.$list.append($item)
      })
    })
  }

  createElItem(user) {
    const $el = document.createElement('img')
    $el.setAttribute('src', user.avatar)
    $el.setAttribute('data-id', user.id)
    $el.setAttribute('data-action', 'kick')
    $el.setAttribute('alt', 'user')
    return $el;
  }
}
