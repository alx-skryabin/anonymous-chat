import {Socket} from 'socket.io-client'
import {EVENTS} from '../configs/events'
import {preloadGoRoom} from '../templates/blocks'

// Интерфейс для данных, получаемых от сервера
interface CreateRoomResponse {
  code: number
  message: string
  name?: string
}

export class CreateRoom {
  private socket: Socket
  private $root: HTMLElement
  private $form: HTMLFormElement
  private $submit: HTMLElement

  constructor(socket: Socket) {
    this.socket = socket
    const root = document.getElementById('modalCreateRoom')
    if (!root) throw new Error('Element #modalCreateRoom not found')
    this.$root = root

    const form = this.$root.querySelector('form') as HTMLFormElement
    if (!form) throw new Error('Form not found in #modalCreateRoom')
    this.$form = form

    const submit = this.$root.querySelector('.modal-footer a') as HTMLElement
    if (!submit) throw new Error('Submit button not found in #modalCreateRoom')
    this.$submit = submit

    this.init()
  }

  private init(): void {
    // @ts-ignore
    const {name, pass, isPrivate} = this.$form.elements as {
      name: HTMLInputElement
      pass: HTMLInputElement
      isPrivate: HTMLInputElement
    }
    const $tips = document.querySelector('.modal-tips') as HTMLElement

    this.$submit.addEventListener('click', () => {
      let error = ''
      $tips.textContent = error

      if (name.value.trim().length < 3) {
        error = 'Minimum length of the room name is 3 characters.'
      }
      if (isPrivate.checked && !pass.value.trim()) {
        error = `${error} Enter password.`
      }

      if (error) {
        $tips.textContent = error
        return
      }

      this.socket.emit(EVENTS.CREATE_ROOM, {
        name: name.value.trim().toLowerCase(),
        password: pass.value.trim() || false
      })
    })

    this.socket.on(EVENTS.CREATE_ROOM, (data: CreateRoomResponse) => {
      switch (data.code) {
        case 1:
          $tips.innerHTML = preloadGoRoom(data.message)
          if (data.name) this.goToRoom(data.name)
          break
        case 2:
          $tips.textContent = data.message
          M.updateTextFields() // Предполагается, что M из Materialize CSS
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

  private goToRoom(room: string): void {
    const newURI = `${window.location.origin}/?room=${room}`
    this.$form.reset()

    setTimeout(() => {
      document.location.href = newURI
    }, 3000)
  }
}
