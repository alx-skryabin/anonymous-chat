import {AvatarGenerator} from 'random-avatar-generator'
import M from 'materialize-css'

function defineHostURI(): string {
  return process.env.BACKEND_URL || 'http://localhost:5000'
}

function getAvatarURI(): string {
  const url = new AvatarGenerator()
  return url.generateRandomAvatar()
}

function setAvatar(url: string): void {
  const $img = document.querySelector('.footer_avatar img') as HTMLImageElement
  const $imgMenu = document.querySelector('.user-view .circle') as HTMLImageElement
  if ($img) $img.setAttribute('src', url)
  if ($imgMenu) $imgMenu.setAttribute('src', url)
}

function scrollToMsg($el: HTMLElement): void {
  $el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

function getDateTime(): string {
  return new Date().toLocaleString().split(',').join('')
}

function replaceSymbol(str: string): string {
  const regArr: [string, string][] = [
    ["'", '"'],
    ['<', '«'],
    ['>', '»']
  ]
  return regArr.reduce((acc: string, item: [string, string]) => {
    const [inp, out] = item
    const reg = new RegExp(`\\${inp}`, 'gi')
    return acc.replace(reg, out)
  }, str)
}

function initTooltip(): void {
  const elems = document.querySelectorAll('.tooltipped')
  M.Tooltip.init(elems)
}

function initMenu(): void {
  const elems = document.querySelectorAll('.sidenav')
  M.Sidenav.init(elems)
}

function initModals(): void {
  const elems = document.querySelectorAll('.modal')
  M.Modal.init(elems)
}

function addPulseAnim($elem: HTMLElement, duration: number = 3): void {
  $elem.classList.add('pulse')
  setTimeout(() => {
    $elem.classList.remove('pulse')
  }, duration * 1000)
}

function addDeleteAnim($elem: HTMLElement): void {
  $elem.classList.add('delete-anim', 'red', 'lighten-2')
  setTimeout(() => $elem.remove(), 1000)
}

function getNameRoom(): string | null {
  const baseUri = new URL(window.location.href)
  return baseUri.searchParams.get('room')?.toLowerCase() ?? null
}

function initMeterialized(): void {
  initTooltip()
  initMenu()
  initModals()
}

export {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  getDateTime,
  replaceSymbol,
  addPulseAnim,
  addDeleteAnim,
  initMeterialized,
  getAvatarURI,
  getNameRoom
}
