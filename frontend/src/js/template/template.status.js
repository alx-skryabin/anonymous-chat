import {getNameRoom} from '../chat/utils'

const status = () => {
  return `
    <div class="status">
      <div class="status-root">
        <i class="fas fa-pastafarianism"></i> <span>Root</span>
      </div>
      <div class="status-count">
        <i class="fas fa-users"></i> <span>Online:</span> <strong id="countUsers">0</strong>
      </div>
      <div class="status-room">
        <i class="fas fa-couch"></i> <span>Room:</span> <strong>${getNameRoom() || 'free'}</strong>
      </div>
      <div class="status-private"></div>
      ${debug()}
    </div>
  `
}

const debug = () => {
  return `
    <div class="debug">
      <button data-debug="11">room</button>
      <button data-debug="22">user</button>
    </div>
  `
}

export {status}
