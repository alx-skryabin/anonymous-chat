export class CreateRoom {
  constructor() {
    this.$root = document.getElementById('modalCreateRoom')
    this.$private = this.$root.querySelector('[type="checkbox"]')
    this.$submit = this.$root.querySelector('.modal-footer a')
    this.$password = this.$root.querySelector('#roomPass')
    this.$form = this.$root.querySelector('form')

    this.init()
  }

  init() {
    this.$submit.addEventListener('click', () => {
      console.log(this.$form.elements.name.value)
    })

    this.$private.addEventListener('change', () => {
      if (this.$private.checked) {
        this.$password.removeAttribute('disabled')
      } else {
        this.$password.setAttribute('disabled', 'disabled')
        this.$password.value = ''
      }
    })
  }
}
