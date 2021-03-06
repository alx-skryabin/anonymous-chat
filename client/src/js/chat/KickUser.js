import {EVENT} from './config'
import {resultVoting, youKick} from '../template/template.blocks'

export class KickUser {
  constructor(chat, socket) {
    this.chat = chat
    this.socket = socket
    this.room = null
    this.$list = this.chat.modals.userKick.el.querySelector('.list-users')
    this.$voting = this.chat.modals.votingKick.el.querySelector('.voting-box')
    this.$timer = this.chat.modals.votingKick.el.querySelector('.determinate')
    this.prepare()
  }

  prepare() {
    this.setEventSocket()
    this.setEventOpen()
    this.setEventKick()
  }

  setEventOpen() {
    this.chat.modals.userKick.options.onOpenStart = () => {
      this.socket.emit(EVENT.GET_USERS)
      this.$timer.style.width = '100%'
    }
  }

  setEventKick() {
    this.$list.addEventListener('click', e => {
      if (e.target.dataset.action === 'kick') {
        this.chat.modals.userKick.close()
        this.socket.emit(EVENT.VOTING_INIT, {
          id: e.target.dataset.id
        })
      }
    })

    this.$voting.addEventListener('click', e => {
      const value = e.target.dataset.voting
      if (value) {
        this.chat.modals.votingKick.close()

        this.socket.emit(EVENT.VOTING_POINT, {
          room: this.room,
          isRoot: this.chat.isRoot,
          value
        })
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

    this.socket.on(EVENT.VOTING_INIT, data => {
      const {avatar, room, allowVoting, time} = data

      if (allowVoting) {
        this.room = room
        this.chat.modals.votingKick.open()
        this.timerStart(time)
        this.chat.modals.votingKick.options.dismissible = false
        this.$voting.querySelector('img').setAttribute('src', avatar)
      } else {
        M.toast({html: 'Wait for the completion of the previous vote', classes: 'rounded'})
      }
    })

    this.socket.on(EVENT.VOTING_RESULT, data => {
      this.chat.modals.votingKick.close()
      this.chat.modals.votingResult.open()
      this.declareVoting(data)
    })

    this.socket.on(EVENT.VOTING_FINISH, ({d, l}) => {
      if (d > l) {
        this.socket.disconnect()
        const $app = document.querySelector('.app')
        $app.innerHTML = youKick(d, l)
      }
    })
  }

  declareVoting(data) {
    this.chat.modals.votingResult.el
      .querySelector('.voting-box-result')
      .innerHTML = resultVoting(data)
  }

  timerStart(time) {
    let progress = 100
    const step = progress / time

    let timeId = setInterval(() => {
      time--
      progress -= step
      this.$timer.style.width = `${progress}%`
      if (time === 0) clearInterval(timeId)
    }, 1000)
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
