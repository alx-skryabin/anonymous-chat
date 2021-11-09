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

const modals = () => {
  return `
     ${modalCreateRoom()}
     ${modalRoot()}
  `
}

export {modals}
