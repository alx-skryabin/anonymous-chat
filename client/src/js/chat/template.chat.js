import {getDateTime} from './utils'

const title = () => {
  return `
    <h1><i class="fas fa-ghost"></i> Anonymous Сhat</h1>
  `
}

const menuBtn = () => {
  return `
    <a href="#" class="sidenav-trigger waves-effect waves-light" data-target="slide-out">
      <i class="fas fa-sliders-h"></i> Menu
    </a>
  `
}

const menuSidenav = () => {
  return `
    <ul id="slide-out" class="sidenav">
      <li>
        <div class="user-view">
          <div class="background">
            <img src="https://static.tildacdn.com/tild6337-6165-4433-a135-366466326266/-/resize/504x/hightechImage.png" alt="bg">
          </div>
          <img class="circle" alt="avatar" src="">
        </div>
      </li>
      <li><a href="#modalCreateRoom" class="modal-trigger"><i class="fas fa-plus"></i> Create room</a></li>
      <li><a href="#"><i class="fas fa-crosshairs"></i> Kick out user</a></li>
      <li><a href="#"><i class="far fa-comments"></i> Free rooms</a></li>
      <li><div class="divider"></div></li>
      <li><a href="#modalRoot" class="modal-trigger"><i class="fas fa-fingerprint"></i> I am root</a></li>
    </ul>
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
    <div class="footer_form z-depth-5">
      <input type="text" id="field" placeholder="Type here...">
      <button id="send" class="waves-effect waves-light blue darken-1">
        <i class="far fa-paper-plane"></i>
      </button>
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

const message = (owner = 'owner', text = '', msgId, avatar) => {
  const classMsg = owner === 'owner' ? 'msg-owner' : 'msg-friend'
  const $el = document.createElement('div')
  $el.className = `msg-chat ${classMsg}`
  $el.setAttribute('id', msgId)

  const msgEdit = `
  <div class="msg-chat-edit">
    <i class="far fa-edit" data-action="edit-msg"></i>
  </div>`

  const msgDelete = `
  <div class="msg-chat-delete">
    <i class="far fa-trash-alt" data-action="delete-msg"></i>
  </div>`

  $el.innerHTML = `
      <div class="msg-chat-avatar">
          <img src="${avatar}" alt="ava">
      </div>
      <div class="msg-chat-text z-depth-5">
          ${text}
      </div>
      <div class="msg-chat-date">
        ${getDateTime()}
      </div>
      ${owner === 'owner' ? msgEdit : ''}
      ${owner === 'owner' ? msgDelete : ''}
  `
  return $el
}

const header = () => {
  return `
    <div class="header">
      ${menuBtn()}
      ${title()}
      ${feedback()}
      ${menuSidenav()}
    </div>
  `
}

const status = () => {
  return `
    <div class="status">
      <div class="status-count">
        <i class="fas fa-users"></i> Online: <strong id="countUsers">0</strong>
      </div>
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

const modals = () => {
  return `
     ${modalCreateRoom()}
     ${modalRoot()}
  `
}

const modalCreateRoom = () => {
  return `
    <div id="modalCreateRoom" class="modal modal-create-room">
      <div class="modal-content">
        <h5><i class="fas fa-plus"></i> Create your own room</h5>
        <form>
          <div class="input-field">
            <input id="roomName" type="text" name="name" autocomplete="off">
            <label for="roomName">Room name</label>
          </div>
          <div class="input-field">
            <input id="roomPass" type="password" name="pass" disabled>
            <label for="roomPass">Room password</label>
          </div>
          <label>
            <input type="checkbox" name="isPrivate"/>
            <span>Private room</span>
          </label>
        </form>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Create</a>
      </div>
    </div>
  `
}

const modalRoot = () => {
  return `
    <div id="modalRoot" class="modal modal-root">
      <div class="modal-content">
        <h5><i class="fas fa-fingerprint"></i> Root access</h5>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Enter</a>
      </div>
    </div>
  `
}

const template = () => {
  return `
    <div class="chat">
      ${header()}
      ${status()}
      ${content()}
      ${footer()}
      ${modals()}
    </div>
  `
}

export {template, message}
