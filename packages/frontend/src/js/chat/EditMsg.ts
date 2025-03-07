export class EditMsg {
  private $input: HTMLInputElement
  private $msg: HTMLElement | null
  public isEdit: boolean // Оставляем public, так как используется в Chat.ts
  public msgId: string | null // Оставляем public, так как используется в Chat.ts

  constructor($input: HTMLInputElement) {
    this.$input = $input
    this.$msg = null
    this.isEdit = false
    this.msgId = null
  }

  check($target: HTMLElement): void {
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

  edit($target: HTMLElement): void {
    this.$input.value = this.getMsgText($target)
    this.$input.focus()
    this.isEdit = true
  }

  getMsgText($target: HTMLElement): string {
    this.$msg = $target.closest('.msg-chat') as HTMLElement
    this.$msg.classList.add('msg-edited')
    this.msgId = this.$msg.getAttribute('id')
    const $msgText = this.$msg.querySelector('.msg-chat-text') as HTMLElement
    return $msgText.innerText
  }

  reset(): void {
    if (!this.isEdit) return
    if (this.$msg) {
      this.$msg.classList.remove('msg-edited')
    }
    this.$input.value = ''
    this.isEdit = false
    this.msgId = null
    this.$msg = null
  }

  delete($target: HTMLElement): string | null {
    this.reset()
    return this.defineId($target)
  }

  defineId($target: HTMLElement): string | null {
    const $msg = $target.closest('.msg-chat') as HTMLElement
    return $msg ? $msg.getAttribute('id') : null
  }
}
