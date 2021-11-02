import {getAvatarURI} from './utils'

const title = () => {
  return `
    <h1>Anonymous Сhat</h1>
  `
}

const form = () => {
  return `
    <div class="footer_form">
      <input type="text" id="field" placeholder="Type here...">
      <button id="send">Send</button>
    </div>
  `
}

const avatar = () => {
  return `
    <div class="footer_avatar">
      <img src="${getAvatarURI()}" alt="avatar">
    </div>
  `
}

const header = () => {
  return `
    <div class="header">
      ${title()}
    </div>
  `
}

const content = () => {
  return `
    <div class="content">
      <p>content</p>
    </div>
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

export {template}
