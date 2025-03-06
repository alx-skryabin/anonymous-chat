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

const footer = () => {
  return `
    <div class="footer">
      ${avatar()}
      ${form()}
    </div>
  `
}

export {footer}
