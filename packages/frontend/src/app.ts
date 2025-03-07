import {io} from 'socket.io-client'
import {greet, User} from '@anonymous-chat/shared'
import './styles/main.scss'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const socket = io(BACKEND_URL)

// Элементы DOM
const chat = document.getElementById('chat') as HTMLDivElement
const messageInput = document.getElementById('message') as HTMLInputElement
const sendButton = document.getElementById('send') as HTMLButtonElement

// Пример использования shared
const user: User = {id: 1, name: 'Anonymous'}
console.log(greet(user))

// Обработка сообщений
socket.on('connect', () => {
  console.log('Connected to backend')
  chat.innerHTML += '<p>Connected to chat!</p>'
})

socket.on('message', (msg: string) => {
  chat.innerHTML += `<p>${msg}</p>`
})

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim()
  console.log(message)
  if (message) {
    socket.emit('message', message)
    messageInput.value = ''
  }
})
