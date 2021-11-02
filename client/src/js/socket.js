import {io} from 'socket.io-client'
import {defineURI} from './utils'

const socket = io(defineURI(), {})

const emitSocket = () => {
  // const $msg = document.querySelector('#output-msg')

  socket.on('chat message', data => {
    console.log(data.message)
    // $msg.textContent = data.message
  })
}

const sendMsg = $input => {
  if (!$input.value.trim()) return

  socket.emit('chat message', {
    message: $input.value
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
