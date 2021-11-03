import {getDateTime} from './utils'

const title = () => {
  return `
    <h1><i class="fas fa-ghost"></i> Anonymous Сhat</h1>
  `
}

const feedback = () => {
  return `
    <div class="feedback">
      <span><i class="fas fa-code-branch"></i> Improvements? — </span>
      <a href="https://github.com/alx-skryabin/node-socket" target="_blank">github</a>
    </div>
  `
}

const form = () => {
  return `
    <div class="footer_form">
      <input type="text" id="field" placeholder="Type here...">
      <button id="send"><i class="far fa-paper-plane"></i></button>
    </div>
  `
}

const avatar = () => {
  return `
    <div class="footer_avatar">
      <img src="" 
      alt="avatar" 
      class="tooltipped" 
      data-position="top" 
      data-tooltip="Click to change avatar">
    </div>
  `
}

const message = (owner = 'owner', text = '', avatar) => {
  const classMsg = owner === 'owner' ? 'msg-owner' : 'msg-friend'
  const $el = document.createElement('div')
  $el.className = `msg-chat ${classMsg}`

  $el.innerHTML = `
      <div class="msg-chat-avatar">
          <img src="${avatar}" alt="ava">
      </div>
      <div class="msg-chat-text">
          ${text}
      </div>
      <div class="msg-chat-date">
        ${getDateTime()}
      </div>
  `
  return $el
}

const header = () => {
  return `
    <div class="header">
      ${title()}
      ${feedback()}
    </div>
  `
}

const content = () => {
  return `
    <div id="chatContent" class="content"></div>
  `
}

const footer = () => {
  return `
    <div class="footer">
      ${avatar()}
      ${form()}
    </div>
  `
}

const template = () => {
  return `
    <div class="chat">
      ${header()}
      ${content()}
      ${footer()}
    </div>
  `
}

export {template, message}
