import {getNameRoom} from '../chat/utils'

const status = () => {
  return `
    <div class="status">
      <div class="status-count">
        <i class="fas fa-users"></i> Online: <strong id="countUsers">0</strong>
      </div>
      <div class="status-room">
        <i class="fas fa-couch"></i> Room: <strong>${getNameRoom() || 'free'}</strong>
      </div>
      ${debug()}
    </div>
  `
}

const debug = () => {
  return `
    <div class="debug">
      <button data-debug="11">11</button>
      <button data-debug="22">22</button>
    </div>
  `
}

export {status}
