import {EVENT} from "./config";

export class RootUser {
  constructor(chat, socket, modals) {
    this.chat = chat
    this.modals = modals
    this.socket = socket
    this.isRoot = false
    this.isDebug = true
    this.$debug = this.chat.$app.querySelector('.debug')
    this.prepare()
  }

  prepare() {
    this.debug()
    this.setEvent()
    this.setEventSocket()

    this.modals.rootAccess.options.onOpenStart = () => {
      this.chat.$app.querySelector('#formRoot').reset()
    }
  }

  setEvent() {
    const $form = this.modals.rootAccess.el.querySelector('#formRoot')
    $form.onsubmit = e => {
      e.preventDefault()

      this.socket.emit(EVENT.TURN_ROOT, {
        password: $form['rootPass'].value.trim()
      })
      $form.reset()
    }
  }

  setEventSocket() {
    this.socket.on(EVENT.TURN_ROOT, identity => {
      if (identity) this.modals.rootAccess.close()
      const tips = identity ? 'You are Root now' : 'Access denied'
      M.toast({html: tips, classes: 'rounded'})
    })
  }

  debug() {
    this.debugSwitch(this.isDebug)

    this.$debug.addEventListener('click', e => {
      if (e.target.dataset.debug === '11') this.socket.emit('11')
      if (e.target.dataset.debug === '22') this.socket.emit('22')
    })

    this.socket.on('11', data => console.log('room', data))
    this.socket.on('22', data => console.log('user', data))
  }

  debugSwitch(status) {
    this.$debug.style.display = status ? 'block' : 'none'
  }
}
