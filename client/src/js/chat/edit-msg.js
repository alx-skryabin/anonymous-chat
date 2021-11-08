export class EditMsg {
  constructor($input) {
    this.$input = $input
    this.$msg = null
    this.isEdit = false
    this.msgId = null
  }

  check($target) {
    if (this.isEdit) {
      if (this.defineId($target) === this.msgId) {
        this.reset()
      } else {
        this.reset()
        this.edit($target)
      }
    } else {
      this.edit($target)
    }
  }

  edit($target) {
    this.$input.value = this.getMsgText($target)
    this.$input.focus()
    this.isEdit = true
  }

  getMsgText($target) {
    this.$msg = $target.closest('.msg-chat')
    this.$msg.classList.add('msg-edited')
    this.msgId = this.$msg.getAttribute('id')
    return this.$msg.querySelector('.msg-chat-text').innerText
  }

  reset() {
    this.$msg.classList.remove('msg-edited')
    this.$input.value = ''
    this.isEdit = false
    this.msgId = null
    this.$msg = null
  }

  defineId($target) {
    return $target.closest('.msg-chat').getAttribute('id')
  }
}
