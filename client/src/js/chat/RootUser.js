import {EVENT} from "./config";

export class RootUser {
  constructor(chat, socket) {
    this.chat = chat
    this.socket = socket
    this.isDebug = false
    this.$debug = this.chat.$app.querySelector('.debug')
    this.prepare()
  }

  prepare() {
    this.debug()
    this.setEvent()
    this.setEventSocket()

    this.chat.modals.rootAccess.options.onOpenStart = () => {
      this.chat.$app.querySelector('#formRoot').reset()
    }
  }

  setEvent() {
    const $form = this.chat.modals.rootAccess.el.querySelector('#formRoot')
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
      const tips = identity ? 'You are Root now' : 'Access denied'
      M.toast({html: tips, classes: 'rounded'})

      if (identity) {
        this.chat.modals.rootAccess.close()
        this.chat.isRoot = true
        this.chat.statusBar.setIsRoot()
        this.debugSwitch(true)
      }
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
    if (status) M.toast({html: 'Debug is enabled', classes: 'rounded'})
  }
}
