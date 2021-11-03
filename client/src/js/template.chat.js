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
      <img src="" alt="avatar">
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
  `
  return $el
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
