import {Socket} from 'socket.io-client'
import {EVENTS} from '../configs/events'
import {Chat} from './Chat'
import M from 'materialize-css'

// Интерфейс для данных от события TURN_ROOT
interface TurnRootData {
  identity: boolean
  root: boolean
}

export class RootUser {
  private chat: Chat
  private socket: Socket
  private isDebug: boolean
  private $debug: HTMLElement

  constructor(chat: Chat, socket: Socket) {
    this.chat = chat
    this.socket = socket
    this.isDebug = this.chat.isRoot
    const $debug = this.chat.$app?.querySelector('.debug')
    if (!$debug) throw new Error('Debug element not found in .app')
    this.$debug = $debug as HTMLElement

    this.prepare()
  }

  private prepare(): void {
    this.debug()
    this.setEvent()
    this.setEventSocket()

    this.chat.modals.rootAccess.options.onOpenStart = () => {
      const $formRoot = this.chat.$app?.querySelector('#formRoot') as HTMLFormElement
      if ($formRoot) $formRoot.reset()
    }
  }

  private setEvent(): void {
    const $form = this.chat.modals.rootAccess.el.querySelector('#formRoot') as HTMLFormElement
    $form.onsubmit = (e: Event) => {
      e.preventDefault()

      const rootPass = ($form['rootPass'] as HTMLInputElement).value.trim()
      this.socket.emit(EVENTS.TURN_ROOT, {
        userId: this.chat.userId,
        password: rootPass
      })
      $form.reset()
      M.updateTextFields()
    }
  }

  private setEventSocket(): void {
    this.socket.on(EVENTS.TURN_ROOT, (data: TurnRootData) => {
      const tips = data.identity ? `Root is — ${data.root}` : 'Access denied'
      M.toast({html: tips, classes: 'rounded'})

      if (data.identity) {
        this.chat.modals.rootAccess.close()
        this.setRootOptions(data.root)

        if (data.root) {
          sessionStorage.setItem('root', 'true')
        } else {
          sessionStorage.removeItem('root')
        }
      }
    })
  }

  private setRootOptions(status: boolean): void {
    this.chat.isRoot = status
    this.chat.statusBar.setIsRoot(status)
    this.debugSwitch(status)
  }

  private debug(): void {
    this.debugSwitch(this.isDebug)

    this.$debug.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement
      if (target.dataset.debug === '11') this.socket.emit('11')
      if (target.dataset.debug === '22') this.socket.emit('22')
    })

    this.socket.on('11', (data: unknown) => console.log('room', data))
    this.socket.on('22', (data: unknown) => console.log('user', data))
  }

  private debugSwitch(status: boolean): void {
    this.$debug.style.display = status ? 'block' : 'none'
    if (status) M.toast({html: 'Debug is enabled', classes: 'rounded'})
  }
}
