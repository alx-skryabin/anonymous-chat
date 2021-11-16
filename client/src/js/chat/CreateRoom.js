import {EVENT} from './config'
import {preloadGoRoom} from '../template/template.blocks'

export class CreateRoom {
  constructor(socket) {
    this.socket = socket
    this.$root = document.getElementById('modalCreateRoom')
    this.$form = this.$root.querySelector('form')
    this.$submit = this.$root.querySelector('.modal-footer a')

    this.init()
  }

  init() {
    const {name, pass, isPrivate} = this.$form.elements
    const $tips = document.querySelector('.modal-tips')

    this.$submit.addEventListener('click', () => {
      let error = ''
      $tips.textContent = error

      if (name.value.trim().length < 3) error = 'Minimum length of the room name is 3 characters.'
      if (isPrivate.checked && !pass.value.trim()) error = `${error} Enter password.`

      if (error) return $tips.textContent = error

      this.socket.emit(EVENT.CREATE_ROOM, {
        name: name.value.trim().toLowerCase(),
        password: pass.value.trim() || false
      })
    })

    this.socket.on(EVENT.CREATE_ROOM, data => {
      switch (data.code) {
        case 1:
          $tips.innerHTML = preloadGoRoom(data.message)
          this.goToRoom(data.name)
          break
        case 2:
          $tips.textContent = data.message
          M.updateTextFields()
          break
      }
    })

    isPrivate.addEventListener('change', () => {
      if (isPrivate.checked) {
        pass.removeAttribute('disabled')
      } else {
        pass.setAttribute('disabled', 'disabled')
        pass.value = ''
      }
    })
  }

  goToRoom(room) {
    const newURI = `${window.location.origin}/?room=${room}`
    this.$form.reset()

    setTimeout(() => {
      document.location.href = newURI
    }, 3000)
  }
}
