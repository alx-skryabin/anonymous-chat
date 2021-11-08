import {io} from 'socket.io-client'
import {message, template} from './template.chat'
import {StatusBar} from './status-bar'
import {EditMsg} from './edit-msg'
import {EVENT} from './config'
import {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  replaceSymbol,
  initMeterialized,
  addPulseAnim,
  addDeleteAnim
} from './utils'

const socket = io(defineHostURI(), {})

class Chat {
  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.avatar = null
    this.$input = null
    this.$content = null
    this.statusBar = null

    this.prepare()
  }

  prepare() {
    this.render()
    this.statusBar = new StatusBar()
    this.editMsg = new EditMsg(this.$input)
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    this.initEvent()
    initMeterialized()
  }

  render() {
    document.querySelector('.app')
      .innerHTML = template()

    this.avatar = setAvatar()
    this.$input = document.querySelector('#field')
    this.$content = document.querySelector('#chatContent')
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
        $msg.textContent = replaceSymbol(data.message).toString()
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
