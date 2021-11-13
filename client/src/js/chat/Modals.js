export class Modals {
  constructor() {
    this.createRoom = null
    this.rootAccess = null
    this.listRoom = null

    this.init()
  }

  init() {
    this.createRoom = M.Modal.getInstance(document.getElementById('modalCreateRoom'))
    this.rootAccess = M.Modal.getInstance(document.getElementById('modalRootAccess'))
    this.listRoom = M.Modal.getInstance(document.getElementById('modalListRoom'))
  }
}
