import {URIlocal, URIprod} from './config'
import {AvatarGenerator} from 'random-avatar-generator'

function defineHostURI() {
  return document.location.host.indexOf('localhost') ? URIprod : URIlocal
}

function getAvatarURI() {
  const url = new AvatarGenerator()
  return url.generateRandomAvatar()
}

function setAvatar(url) {
  const $img = document.querySelector('.footer_avatar img')
  const $imgMenu = document.querySelector('.user-view .circle')
  $img.setAttribute('src', url)
  $imgMenu.setAttribute('src', url)
}

function scrollToMsg($el) {
  $el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

function getDateTime() {
  return new Date().toLocaleString().split(',').join('')
}

function replaceSymbol(str) {
  const regArr = [
    ["'", '"'],
    ['<', '«'],
    ['>', '»']
  ]
  return regArr.reduce((str, item) => {
    let [inp, out] = item
    let reg = new RegExp(`\\${inp}`, 'gi')
    return str.replace(reg, out)
  }, str)
}

function initTooltip() {
  const elems = document.querySelectorAll('.tooltipped')
  M.Tooltip.init(elems)
}

function initMenu() {
  const elems = document.querySelectorAll('.sidenav')
  M.Sidenav.init(elems)
}

function initModals() {
  const elems = document.querySelectorAll('.modal')
  M.Modal.init(elems)
}

function addPulseAnim($elem, duration = 3) {
  $elem.classList.add('pulse')

  setTimeout(() => {
    $elem.classList.remove('pulse')
  }, duration * 1000)
}

function addDeleteAnim($elem) {
  $elem.classList.add('delete-anim', 'red', 'lighten-2')
  setTimeout(() => $elem.remove(), 1000)
}

function getNameRoom() {
  const baseUri = new URL(window.location.href)
  return baseUri.searchParams.get('room')?.toLowerCase()
}

function initMeterialized() {
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
