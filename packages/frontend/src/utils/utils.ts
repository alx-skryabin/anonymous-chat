import {AvatarGenerator} from 'random-avatar-generator'
import M from 'materialize-css'

const avatar = {
  getURI: (): string => {
    const url = new AvatarGenerator()
    return url.generateRandomAvatar()
  },
  setAvatar(url: string): void {
    const $img = document.querySelector('.footer_avatar img') as HTMLImageElement
    const $imgMenu = document.querySelector('.user-view .circle') as HTMLImageElement
    if ($img) $img.setAttribute('src', url)
    if ($imgMenu) $imgMenu.setAttribute('src', url)
  }
}

const anim = {
  addPulseAnim($elem: HTMLElement, duration: number = 3): void {
    $elem.classList.add('pulse')
    setTimeout(() => {
      $elem.classList.remove('pulse')
    }, duration * 1000)
  },
  addDeleteAnim($elem: HTMLElement): void {
    $elem.classList.add('delete-anim', 'red', 'lighten-2')
    setTimeout(() => $elem.remove(), 1000)
  }
}

const tools = {
  scrollToMsg($el: HTMLElement): void {
    $el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  },
  getDateTime(): string {
    return new Date().toLocaleString().split(',').join('')
  },
  replaceSymbol(str: string): string {
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
  },
  getNameRoom(): string | null {
    const baseUri = new URL(window.location.href)
    return baseUri.searchParams.get('room')?.toLowerCase() ?? null
  },
  initMeterialized(): void {
    const tooltips = document.querySelectorAll('.tooltipped')
    M.Tooltip.init(tooltips)

    const navs = document.querySelectorAll('.sidenav')
    M.Sidenav.init(navs)

    const modals = document.querySelectorAll('.modal')
    M.Modal.init(modals)
  }
}

export {avatar, anim, tools}
