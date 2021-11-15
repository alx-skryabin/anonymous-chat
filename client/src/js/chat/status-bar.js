export class StatusBar {
  constructor(chat) {
    this.chat = chat
    this.currentCount = 0
    this.$countUsers = document.querySelector('#countUsers')
  }

  updateCountUsers(value) {
    const classStatus = value > this.currentCount
      ? 'green-text text-accent-2' : 'red-text text-lighten-1'

    this.currentCount = value
    this.$countUsers.className = classStatus
    this.$countUsers.textContent = value

    setTimeout(() => {
      this.$countUsers.className = ''
    }, 2000)
  }

  setIsPrivate() {
    const isPrivate = this.chat.$app.querySelector('.status-private')
    isPrivate.innerHTML = this.chat.isPrivate
      ? '<i class="fas fa-lock"></i> <span>Access:</span> <strong>Private</strong>'
      : '<i class="fas fa-lock-open"></i> <span>Access:</span> <strong>Public</strong>'
  }
}
