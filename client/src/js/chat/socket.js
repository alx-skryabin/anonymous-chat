import {io} from 'socket.io-client'
import {StatusBar} from './status-bar'
import {EditMsg} from './edit-msg'
import {Modals} from './Modals'
import {CreateRoom} from './CreateRoom'
import {EVENT} from './config'
import {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  replaceSymbol,
  initMeterialized,
  addPulseAnim,
  addDeleteAnim,
  getDateTime,
  getNameRoom
} from './utils'
import {
  message,
  template,
  room404,
  roomEnterPass
} from '../template/template.chat'

const socket = io(defineHostURI(), {})

class Chat {
  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.isDebug = false
    this.isPrivate = false
    this.avatar = null
    this.$app = document.querySelector('.app')
    this.$input = null
    this.$content = null
    this.statusBar = null
  }

  render() {
    this.toHTML()
    this.statusBar = new StatusBar(this)
    this.editMsg = new EditMsg(this.$input)
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    this.initEvent()
    initMeterialized()
    this.statusBar.setIsPrivate()
    this.modals = new Modals()
  }

  toHTML() {
    this.$app.innerHTML = template()
    this.$input = document.querySelector('#field')
    this.$content = document.querySelector('#chatContent')
    this.avatar = setAvatar()
  }

  emitMsg() {
    // new message
    socket.on(EVENT.CHAT_MSG, data => {
      const text = replaceSymbol(data.message)

      const $msg = (data.userId === this.userId)
        ? message('owner', text, data.msgId, this.avatar)
        : message('friend', text, data.msgId, data.avatar)

      this.$content.appendChild($msg)
      document.querySelector('head title').textContent = text.toString()
      scrollToMsg($msg)

      if (data.countUser) {
        this.statusBar.updateCountUsers(data.countUser)
      }
    })

    // edit message
    socket.on(EVENT.EDIT_MSG, data => {
      const $editedMsg = document.getElementById(data.msgId)
      if ($editedMsg) {
        const $msg = $editedMsg.querySelector('.msg-chat-text')
        $msg.classList.add('modified')
        $msg.textContent = replaceSymbol(data.message).toString()
        const $date = $editedMsg.querySelector('.msg-chat-date')
        $date.textContent = 'edited ' + getDateTime()
        addPulseAnim($msg, 6)
        M.toast({html: 'The message was edited', classes: 'rounded'})
      }
    })

    // delete message
    socket.on(EVENT.DELETE_MSG, data => {
      const $editedMsg = document.getElementById(data.msgId)
      if ($editedMsg) {
        addDeleteAnim($editedMsg)
        M.toast({html: 'The message was deleted', classes: 'rounded'})
      }
    })
  }

  initEvent() {
    this.$content.addEventListener('click', e => {
      if (e.target.dataset.action === 'edit-msg') {
        this.editMsg.check(e.target)
      }

      if (e.target.dataset.action === 'delete-msg') {
        socket.emit(EVENT.DELETE_MSG, {
          msgId: this.editMsg.delete(e.target)
        })
      }
    })

    const $submit = document.querySelector('#send')
    const $avatar = document.querySelector('.footer_avatar')

    // active form
    $submit.addEventListener('click', () => this.sendMsg())

    this.$input.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.sendMsg()
    })

    // change avatar
    $avatar.addEventListener('click', () => this.avatar = setAvatar())

    // create new room
    new CreateRoom(socket)

    if (this.isDebug) this.debug()
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

    if (!this.editMsg.isEdit) {
      socket.emit(EVENT.CHAT_MSG, {
        message: this.$input.value,
        userId: this.userId,
        avatar: this.avatar
      })
    } else {
      socket.emit(EVENT.EDIT_MSG, {
        message: this.$input.value,
        msgId: this.editMsg.msgId
      })
      this.editMsg.reset()
    }

    this.$input.value = ''
  }

  validatePass(data) {
    const {r, a} = JSON.parse(localStorage.getItem('auth')) || false
    const {message, password, name} = data
    this.isPrivate = true

    if (r === name && a) {
      return this.render()
    }

    this.$app.innerHTML = roomEnterPass(message)
    const $form = this.$app.querySelector('.form-password')

    $form.onsubmit = e => {
      e.preventDefault()

      const enterPass = $form.elements.roomPass.value.trim()
      if (enterPass === password.toString()) {
        localStorage.setItem('auth', JSON.stringify({r: name, a: true}))
        this.render()
      } else {
        $form.elements.roomPass.value = ''
        M.toast({html: 'Invalid password', classes: 'rounded'})
      }
    }
  }

  socketLogin() {
    socket.on(EVENT.SIGN_IN_ROOM, data => {
      switch (data.code) {
        case 1:
          this.render()
          break
        case 2:
          this.validatePass(data)
          break
        case 3:
          this.$app.innerHTML = room404(data.message)
          break
      }
    })
  }

  debug() {
    const $debug = this.$app.querySelector('.debug')
    $debug.style.display = 'block'

    $debug.addEventListener('click', e => {
      if (e.target.dataset.debug === '11') socket.emit('11')
      if (e.target.dataset.debug === '22') socket.emit('22')
    })

    socket.on('11', data => console.log('11', data))
    socket.on('22', data => console.log('22', data))
  }

  initChat() {
    this.socketLogin()

    socket.emit(EVENT.SIGN_IN_ROOM, {
      room: getNameRoom()
    })
  }
}

export {Chat}
