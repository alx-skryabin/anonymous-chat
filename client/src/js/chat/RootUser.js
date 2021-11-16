import {EVENT} from "./config";

export class RootUser {
  constructor(chat, socket) {
    this.chat = chat
    this.socket = socket
    this.isDebug = this.chat.isRoot
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
        userId: this.chat.userId,
        password: $form['rootPass'].value.trim()
      })
      $form.reset()
    }
  }

  setEventSocket() {
    this.socket.on(EVENT.TURN_ROOT, data => {
      const tips = data.identity ? `Root is — ${data.root}` : 'Access denied'
      M.toast({html: tips, classes: 'rounded'})

      if (data.identity) {
        this.chat.modals.rootAccess.close()
        this.setRootOptions(data.root)

        if (data.root) {
          sessionStorage.setItem('root', true)
        } else {
          sessionStorage.removeItem('root')
        }
      }
    })
  }

  setRootOptions(status) {
    this.chat.isRoot = status
    this.chat.statusBar.setIsRoot(status)
    this.debugSwitch(status)
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
