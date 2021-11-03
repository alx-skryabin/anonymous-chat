import {io} from 'socket.io-client'
import {message, template} from './template.chat'
import {StatusBar} from './status-bar'
import {EVENT} from './config'
import {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  replaceSymbol,
  initMeterialized
} from './utils'

const socket = io(defineHostURI(), {})

class Chat {
  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.avatar = null
    this.$input = null
    this.statusBar = null

    this.prepare()
  }

  prepare() {
    this.render()
    this.avatar = setAvatar()
    this.$input = document.querySelector('#field')
    this.statusBar = new StatusBar()
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    initMeterialized()
  }

  render() {
    document.querySelector('.app')
      .innerHTML = template()
  }

  emitMsg() {
    const $content = document.querySelector('#chatContent')

    // $content.addEventListener('click', e => {
    //   if (e.target.dataset.action === 'edit-msg') {
    //     console.log(e.target)
    //   }
    // })

    socket.on(EVENT.CHAT_MSG, data => {
      const text = replaceSymbol(data.message)

      const $msg = (data.userId === this.userId)
        ? message('owner', text, this.avatar)
        : message('friend', text, data.avatar)

      $content.appendChild($msg)
      document.querySelector('head title').textContent = text
      scrollToMsg($msg)

      if (data.countUser) {
        this.statusBar.updateCountUsers(data.countUser)
      }
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
      this.statusBar.updateCountUsers(data.countUser)
      M.toast({html: data.message, classes: 'rounded'})
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
