import {io} from 'socket.io-client'
import {message, template} from './template.chat'
import {EVENT} from './config'
import {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  replaceSymbol,
  initTooltip
} from './utils'

const socket = io(defineHostURI(), {})

class Chat {
  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.avatar = null
    this.$input = null

    this.prepare()
  }

  prepare() {
    this.render()
    this.avatar = setAvatar()
    this.$input = document.querySelector('#field')
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    initTooltip()
  }

  render() {
    document.querySelector('.app')
      .innerHTML = template()
  }

  emitMsg() {
    const $content = document.querySelector('#chatContent')

    socket.on(EVENT.CHAT_MSG, data => {
      const text = replaceSymbol(data.message)

      const $msg = (data.userId === this.userId)
        ? message('owner', text, this.avatar)
        : message('friend', text, data.avatar)

      $content.appendChild($msg)
      document.querySelector('head title').textContent = text
      scrollToMsg($msg)
    })
  }

  emitNewUser() {
    socket.emit(EVENT.CHAT_NEW_USER, {
      userId: this.userId,
      avatar: this.avatar
    })
  }

  emitLeaveUser() {
    socket.on(EVENT.CHAT_LEAVE_USER, data => {
      M.toast({html: `${data.message}: ${data.count}`, classes: 'rounded'})
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
