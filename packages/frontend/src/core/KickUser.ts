import {Socket} from 'socket.io-client'
import {EVENTS} from '../configs/events'
import {resultVoting, youKick} from '../templates/blocks'
import {Chat} from './Chat'
import {User, VotingResultData} from '../types/types'

interface VotingInitData {
  avatar: string
  room: string
  allowVoting: boolean
  time: number
}

export class KickUser {
  private chat: Chat
  private socket: Socket
  private room: string | null
  private $list: HTMLElement
  private $voting: HTMLElement
  private $timer: HTMLElement

  constructor(chat: Chat, socket: Socket) {
    this.chat = chat
    this.socket = socket
    this.room = null
    this.$list = this.chat.modals.userKick.el.querySelector('.list-users') as HTMLElement
    this.$voting = this.chat.modals.votingKick.el.querySelector('.voting-box') as HTMLElement
    this.$timer = this.chat.modals.votingKick.el.querySelector('.determinate') as HTMLElement

    this.prepare()
  }

  private prepare(): void {
    this.setEventSocket()
    this.setEventOpen()
    this.setEventKick()
  }

  private setEventOpen(): void {
    this.chat.modals.userKick.options.onOpenStart = () => {
      this.socket.emit(EVENTS.GET_USERS)
      this.$timer.style.width = '100%'
    }
  }

  private setEventKick(): void {
    this.$list.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      if (target.dataset.action === 'kick') {
        this.chat.modals.userKick.close()
        this.socket.emit(EVENTS.VOTING_INIT, {
          id: target.dataset.id
        })
      }
    })

    this.$voting.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      const value = target.dataset.voting
      if (value) {
        this.chat.modals.votingKick.close()
        this.socket.emit(EVENTS.VOTING_POINT, {
          room: this.room,
          isRoot: this.chat.isRoot,
          value
        })
      }
    })
  }

  private setEventSocket(): void {
    this.socket.on(EVENTS.GET_USERS, (data: {users: User[]}) => {
      this.$list.innerHTML = ''
      data.users.forEach(user => {
        const $item = this.createElItem(user)
        this.$list.append($item)
      })
    })

    this.socket.on(EVENTS.VOTING_INIT, (data: VotingInitData) => {
      const {avatar, room, allowVoting, time} = data

      if (allowVoting) {
        this.room = room
        this.chat.modals.votingKick.open()
        this.timerStart(time)
        this.chat.modals.votingKick.options.dismissible = false
        const $img = this.$voting.querySelector('img') as HTMLImageElement
        $img.setAttribute('src', avatar)
      } else {
        M.toast({html: 'Wait for the completion of the previous vote', classes: 'rounded'})
      }
    })

    this.socket.on(EVENTS.VOTING_RESULT, (data: VotingResultData) => {
      this.chat.modals.votingKick.close()
      this.chat.modals.votingResult.open()
      this.declareVoting(data)
    })

    this.socket.on(EVENTS.VOTING_FINISH, ({d, l}: VotingResultData['result']) => {
      if (d > l) {
        this.socket.disconnect()
        const $app = document.querySelector('.app') as HTMLElement
        $app.innerHTML = youKick(d, l)
      }
    })
  }

  private declareVoting(data: VotingResultData): void {
    const $votingBox = this.chat.modals.votingResult.el.querySelector(
      '.voting-box-result'
    ) as HTMLElement
    $votingBox.innerHTML = resultVoting(data)
  }

  private timerStart(time: number): void {
    let progress = 100
    const step = progress / time

    const timeId = setInterval(() => {
      time--
      progress -= step
      this.$timer.style.width = `${progress}%`
      if (time === 0) clearInterval(timeId)
    }, 1000)
  }

  private createElItem(user: User): HTMLElement {
    const $el = document.createElement('img')
    $el.setAttribute('src', user.avatar)
    $el.setAttribute('data-id', user.id)
    $el.setAttribute('data-action', 'kick')
    $el.setAttribute('alt', 'user')
    return $el
  }
}
