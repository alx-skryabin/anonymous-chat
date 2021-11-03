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

export {defineHostURI, setAvatar, scrollToMsg, getDateTime}
