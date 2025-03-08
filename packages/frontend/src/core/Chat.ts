import {io, Socket} from 'socket.io-client'
import {StatusBar} from './StatusBar'
import {EditMsg} from './EditMsg'
import {Modals} from './Modals'
import {CreateRoom} from './CreateRoom'
import {ListRooms} from './ListRooms'
import {KickUser} from './KickUser'
import {RootUser} from './RootUser'
import {EVENTS} from '@anonymous-chat/shared'
import M from 'materialize-css'
import {message, template, room404, roomEnterPass} from '../templates/chat'
import {avatar, anim, tools} from '../utils/utils'

// Интерфейс для данных сообщений
interface MessageData {
  userId: number
  message: string
  msgId: string
  avatar: string
  msgRoot?: boolean
  countUser?: number
}

interface RoomData {
  code: number
  message: string
  password?: string
  name?: string
}

// Инициализация сокета
const socket: Socket = io(process.env.BACKEND_URL, {
  transports: ['websocket']
})

export class Chat {
  public userId: number
  public isPrivate: boolean
  public isRoot: boolean
  public avatar: string
  public $app: HTMLElement | null
  public $input: HTMLInputElement | null
  public $content: HTMLElement | null
  public statusBar!: StatusBar
  public editMsg!: EditMsg
  public modals!: Modals

  constructor() {
    this.userId = parseInt(String(new Date().getTime()))
    this.isPrivate = false
    this.isRoot = false
    this.avatar = avatar.getURI()
    this.$app = document.querySelector('.app')
    this.$input = null
    this.$content = null
  }

  render(): void {
    this.toHTML()
    tools.initMeterialized()
    this.statusBar = new StatusBar(this)
    this.editMsg = new EditMsg(this.$input!) // Утверждаем, что $input не null после toHTML
    this.modals = new Modals()
    new RootUser(this, socket)
    this.emitNewUser()
    this.emitLeaveUser()
    this.emitMsg()
    this.initEvent()
    this.statusBar.setIsPrivate()
  }

  toHTML(): void {
    if (this.$app) {
      this.$app.innerHTML = template()
      this.$input = document.querySelector('#field') as HTMLInputElement
      this.$content = document.querySelector('#chatContent') as HTMLElement
      avatar.setAvatar(this.avatar)
    }
  }

  emitMsg(): void {
    // Новое сообщение
    socket.on(EVENTS.CHAT_MSG, (data: MessageData) => {
      const text = tools.replaceSymbol(data.message)
      const $msg =
        data.userId === this.userId
          ? message('owner', text, data.msgId, this.avatar)
          : message('friend', text, data.msgId, data.avatar, data.msgRoot, this.isRoot)

      if (this.$content) {
        this.$content.appendChild($msg)
        document.querySelector('head title')!.textContent = text
        tools.scrollToMsg($msg)
      }

      if (data.countUser) {
        this.statusBar.updateCountUsers(data.countUser)
      }
    })

    // Редактирование сообщения
    socket.on(EVENTS.EDIT_MSG, (data: {msgId: string; message: string}) => {
      const $editedMsg = document.getElementById(data.msgId)
      if ($editedMsg) {
        const $msg = $editedMsg.querySelector('.msg-chat-text') as HTMLElement
        $msg.classList.add('modified')
        $msg.textContent = tools.replaceSymbol(data.message)
        const $date = $editedMsg.querySelector('.msg-chat-date') as HTMLElement
        $date.textContent = 'edited ' + tools.getDateTime()
        anim.addPulseAnim($msg, 6)
        M.toast({html: 'The message was edited', classes: 'rounded'})
      }
    })

    // Удаление сообщения
    socket.on(EVENTS.DELETE_MSG, (data: {msgId: string}) => {
      const $editedMsg = document.getElementById(data.msgId)
      if ($editedMsg) {
        anim.addDeleteAnim($editedMsg)
        M.toast({html: 'The message was deleted', classes: 'rounded'})
      }
    })
  }

  initEvent(): void {
    if (this.$content) {
      this.$content.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement
        if (target.dataset.action === 'edit-msg') {
          this.editMsg.check(target)
        }
        if (target.dataset.action === 'delete-msg') {
          socket.emit(EVENTS.DELETE_MSG, {
            msgId: this.editMsg.delete(target)
          })
        }
      })
    }

    const $submit = document.querySelector('#send') as HTMLElement
    const $avatar = document.querySelector('.footer_avatar') as HTMLElement

    $submit.addEventListener('click', () => this.sendMsg())
    if (this.$input) {
      this.$input.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') this.sendMsg()
      })
    }

    $avatar.addEventListener('click', () => {
      this.avatar = avatar.getURI()
      avatar.setAvatar(this.avatar)
      socket.emit(EVENTS.CHANGE_AVATAR, this.avatar)
    })

    new CreateRoom(socket)
    new ListRooms(this, socket)
    new KickUser(this, socket)
  }

  emitNewUser(): void {
    if (this.isRoot) return
    socket.emit(EVENTS.CHAT_NEW_USER, {userId: this.userId})
  }

  emitLeaveUser(): void {
    socket.on(EVENTS.CHAT_LEAVE_USER, (data: {countUser: number; message: string}) => {
      this.statusBar.updateCountUsers(data.countUser)
      M.toast({html: data.message, classes: 'rounded'})
    })
  }

  sendMsg(): void {
    if (!this.$input || !this.$input.value.trim()) return

    if (!this.editMsg.isEdit) {
      socket.emit(EVENTS.CHAT_MSG, {
        message: this.$input.value,
        userId: this.userId,
        msgRoot: this.isRoot,
        avatar: this.avatar
      })
    } else {
      socket.emit(EVENTS.EDIT_MSG, {
        message: this.$input.value,
        msgId: this.editMsg.msgId
      })
      this.editMsg.reset()
    }

    this.$input.value = ''
  }

  validatePass(data: RoomData): void {
    const auth = JSON.parse(sessionStorage.getItem('auth') || 'null') as {
      r: string
      a: boolean
    } | null
    const {message, password, name} = data

    if (auth && auth.r === name && auth.a) {
      return this.render()
    }

    if (this.$app) {
      this.$app.innerHTML = roomEnterPass(message)
      const $form = this.$app.querySelector('.form-password') as HTMLFormElement

      $form.onsubmit = (e: Event) => {
        e.preventDefault()
        const enterPass = ($form['roomPass'] as HTMLInputElement).value.trim()
        if (enterPass === password?.toString()) {
          sessionStorage.setItem('auth', JSON.stringify({r: name, a: true}))
          this.render()
        } else {
          $form.reset()
          M.updateTextFields()
          M.toast({html: 'Invalid password', classes: 'rounded'})
        }
      }
    }
  }

  socketLogin(): void {
    socket.on(EVENTS.SIGN_IN_ROOM, (data: RoomData) => {
      if (data.password) this.isPrivate = true

      switch (data.code) {
        case 1:
          this.render()
          break
        case 2:
          this.validatePass(data)
          break
        case 3:
          if (this.$app) this.$app.innerHTML = room404(data.message)
          break
      }
    })
  }

  initChat(): void {
    this.isRoot = JSON.parse(sessionStorage.getItem('root') || 'false') as boolean
    this.socketLogin()
    socket.emit(EVENTS.SIGN_IN_ROOM, {
      room: tools.getNameRoom(),
      avatar: this.avatar,
      isRoot: this.isRoot
    })
  }
}
