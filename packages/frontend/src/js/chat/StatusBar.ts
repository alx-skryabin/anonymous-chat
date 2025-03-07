import {Chat} from './Chat'

export class StatusBar {
  private chat: Chat
  private currentCount: number
  private $countUsers: HTMLElement

  constructor(chat: Chat) {
    this.chat = chat
    this.currentCount = 0
    const $countUsers = document.querySelector('#countUsers')
    if (!$countUsers) throw new Error('Element #countUsers not found in the DOM')
    this.$countUsers = $countUsers as HTMLElement

    this.setIsRoot(this.chat.isRoot)
  }

  public updateCountUsers(value: number): void {
    const classStatus =
      value > this.currentCount ? 'green-text text-accent-2' : 'red-text text-lighten-1'

    this.currentCount = value
    this.$countUsers.className = classStatus
    this.$countUsers.textContent = value.toString()

    setTimeout(() => {
      this.$countUsers.className = ''
    }, 3000)
  }

  public setIsPrivate(): void {
    const isPrivate = this.chat.$app?.querySelector('.status-private') as HTMLElement
    if (isPrivate) {
      isPrivate.innerHTML = this.chat.isPrivate
        ? '<i class="fas fa-lock"></i> <span>Access:</span> <strong>Private</strong>'
        : '<i class="fas fa-lock-open"></i> <span>Access:</span> <strong>Public</strong>'
    }
  }

  public setIsRoot(status: boolean): void {
    const $statusRoot = this.chat.$app?.querySelector('.status-root') as HTMLElement
    if ($statusRoot) {
      $statusRoot.style.display = status ? 'block' : 'none'
    }
  }
}
