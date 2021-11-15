import {getDateTime} from '../chat/utils'
import {header} from './template.header'
import {status} from './template.status'
import {footer} from './template.footer'
import {modals} from './template.modal'

const message = (
  owner = 'owner',
  text = '',
  msgId,
  avatar,
  msgRoot = false,
  isRoot = false
) => {
  const classMsg = owner === 'owner'
    ? 'msg-owner' : msgRoot ? 'msg-friend msg-root' : 'msg-friend'
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
      ${owner === 'owner' ? msgEdit : isRoot ? msgEdit : ''}
      ${owner === 'owner' ? msgDelete : isRoot ? msgDelete : ''}
  `
  return $el
}

const content = () => {
  return `
    <div id="chatContent" class="content"></div>
  `
}

const room404 = msg => {
  return `
    <div class="container-center">
      <h3 class="common-h3">${msg}</h3>
      <a href="/" class="waves-effect waves-light">To main page</a>
    </div>
  `
}

const roomEnterPass = message => {
  return `
    <div class="container-center">
      <h3 class="common-h3">${message}</h3>
      <form class="form-password">
        <div class="input-field">
          <input id="roomPass" type="password">
          <label for="roomPass">Password</label>
        </div>
        <div>
          <button type="submit" class="waves-effect waves-light">
            <i class="far fa-paper-plane"></i>
          </button>
        </div>
      </form>
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

export {template, message, room404, roomEnterPass}
