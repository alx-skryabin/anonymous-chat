import {io} from 'socket.io-client'
import {defineURI} from './utils'
import {msgFriend, msgOwner} from './base'

const socket = io(defineURI(), {})

const emitSocket = () => {
  const $content = document.querySelector('#chatContent')
  const $input = document.querySelector('#field')

  const userId = parseInt(new Date().getTime())
  $input.setAttribute('data-user', userId)

  socket.on('chat message', data => {

    const $msg = (+data.userId === userId)
      ? msgOwner(data.message)
      : msgFriend(data.message)

    $content.appendChild($msg)

    $msg.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

const sendMsg = $input => {
  if (!$input.value.trim()) return

  const userId = $input.getAttribute('data-user')

  socket.emit('chat message', {
    message: $input.value,
    userId: userId
  })

  $input.value = ''
}

const initEventSocket = () => {
  emitSocket()
  const $submit = document.querySelector('#send')
  const $input = document.querySelector('#field')

  $submit.addEventListener('click', () => sendMsg($input))

  $input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMsg($input)
  })
}

export {initEventSocket}
