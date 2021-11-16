import {io} from 'socket.io-client'
import {StatusBar} from './status-bar'
import {EditMsg} from './edit-msg'
import {Modals} from './Modals'
import {CreateRoom} from './CreateRoom'
import {ListRooms} from './ListRooms'
import {KickUser} from './KickUser'
import {RootUser} from './RootUser'
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
  getNameRoom,
  getAvatarURI
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
    this.isPrivate = false
    this.isRoot = false
    this.avatar = getAvatarURI()
    this.$app = document.querySelector('.app')
    this.$input = null
    this.$content = null
  }

  render() {
    this.toHTML()
    initMeterialized()
    this.statusBar = new StatusBar(this)
    this.editMsg = new EditMsg(this.$input)
    this.modals = new Modals()
    new RootUser(this, socket)
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    this.initEvent()
    this.statusBar.setIsPrivate()
  }

  toHTML() {
    this.$app.innerHTML = template()
    this.$input = document.querySelector('#field')
    this.$content = document.querySelector('#chatContent')
    setAvatar(this.avatar)
  }

  emitMsg() {
    // new message
    socket.on(EVENT.CHAT_MSG, data => {
      const text = replaceSymbol(data.message)

      const $msg = (data.userId === this.userId)
        ? message('owner', text, data.msgId, this.avatar)
        : message('friend', text, data.msgId, data.avatar, data.msgRoot, this.isRoot)

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
    $avatar.addEventListener('click', () => {
      this.avatar = getAvatarURI()
      setAvatar(this.avatar)
      socket.emit(EVENT.CHANGE_AVATAR, this.avatar)
    })

    // create new room
    new CreateRoom(socket)

    // output list rooms
    new ListRooms(this, socket)

    // kick out user
    new KickUser(this, socket)
  }

  emitNewUser() {
    if (this.isRoot) return

    socket.emit(EVENT.CHAT_NEW_USER, {
      userId: this.userId
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
        msgRoot: this.isRoot,
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
    const {r, a} = JSON.parse(sessionStorage.getItem('auth')) || false
    const {message, password, name} = data

    if (r === name && a) {
      return this.render()
    }

    this.$app.innerHTML = roomEnterPass(message)
    const $form = this.$app.querySelector('.form-password')

    $form.onsubmit = e => {
      e.preventDefault()

      const enterPass = $form['roomPass'].value.trim()
      if (enterPass === password.toString()) {
        sessionStorage.setItem('auth', JSON.stringify({r: name, a: true}))
        this.render()
      } else {
        $form.reset()
        M.updateTextFields()
        M.toast({html: 'Invalid password', classes: 'rounded'})
      }
    }
  }

  socketLogin() {
    socket.on(EVENT.SIGN_IN_ROOM, data => {
      if (data.password) this.isPrivate = true

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

  initChat() {
    this.isRoot = JSON.parse(sessionStorage.getItem('root')) || false
    this.socketLogin()

    socket.emit(EVENT.SIGN_IN_ROOM, {
      room: getNameRoom(),
      avatar: this.avatar,
      isRoot: this.isRoot
    })
  }
}

export {Chat}
