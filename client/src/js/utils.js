import {URIlocal, URIprod} from './config'
import {AvatarGenerator} from 'random-avatar-generator'

function defineURI() {
  return document.location.host.indexOf('localhost')
    ? URIprod : URIlocal
}

function getAvatarURI() {
  const url = new AvatarGenerator()
  return url.generateRandomAvatar()
}

export {defineURI, getAvatarURI}
