import {URIlocal, URIprod} from './config'
import {AvatarGenerator} from 'random-avatar-generator'

function defineHostURI() {
  return document.location.host.indexOf('localhost')
    ? URIprod : URIlocal
}

function getAvatarURI() {
  const url = new AvatarGenerator()
  return url.generateRandomAvatar()
}

function setAvatar() {
  const $img = document.querySelector('.footer_avatar img')
  const url = getAvatarURI()
  $img.setAttribute('src', url)
  return url
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
  const regArr = [["'", "\""], ["<", "«"], [">", "»"]]
  return (
    regArr.reduce((str, item) => {
      let [inp, out] = item
      let reg = new RegExp(`\\${inp}`, 'gi')
      return str.replace(reg, out);
    }, str)
  )
}

function initTooltip() {
  const elems = document.querySelectorAll('.tooltipped')
  M.Tooltip.init(elems)
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

function initMeterialized() {
  initTooltip()
}

export {
  defineHostURI,
  setAvatar,
  scrollToMsg,
  getDateTime,
  replaceSymbol,
  addPulseAnim,
  addDeleteAnim,
  initMeterialized
}
