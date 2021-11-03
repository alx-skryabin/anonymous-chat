import {io} from 'socket.io-client'
import {defineHostURI, setAvatar, scrollToMsg} from './utils'
import {message} from './template.chat'
import {EVENT} from './config'

const socket = io(defineHostURI(), {})

class Chat {
  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.avatar = null
    this.$input = document.querySelector('#field')

    this.prepare()
  }

  prepare() {
    this.avatar = setAvatar()
    this.emitNewUser()
    this.emitMsg()
  }

  emitMsg() {
    const $content = document.querySelector('#chatContent')

    socket.on(EVENT.CHAT_MSG, data => {
      const $msg = (data.userId === this.userId)
        ? message('owner', data.message, this.avatar)
        : message('friend', data.message, data.avatar)

      $content.appendChild($msg)
      scrollToMsg($msg)
    })
  }

  emitNewUser() {
    socket.emit(EVENT.CHAT_NEW_USER, {
      userId: this.userId,
      avatar: this.avatar
    })
  }

  sendMsg() {
    if (!this.$input.value.trim()) return

    socket.emit(EVENT.CHAT_MSG, {
      message: this.$input.value,
      userId: this.userId,
      avatar: this.avatar
    })

    this.$input.value = ''
  }

  initChat() {
    const $submit = document.querySelector('#send')
    const $avatar = document.querySelector('.footer_avatar')

    // active form
    $submit.addEventListener('click', () => this.sendMsg())

    this.$input.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.sendMsg()
    })

    // change avatar
    $avatar.addEventListener('click', () => this.avatar = setAvatar())
  }
}

export {Chat}
