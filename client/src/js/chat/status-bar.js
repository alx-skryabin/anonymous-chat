export class StatusBar {
  constructor() {
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
}
