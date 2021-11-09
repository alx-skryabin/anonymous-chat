export class Modals {
  constructor() {
    this.createRoom = null
    this.rootAccess = null

    this.init()
  }

  init() {
    this.createRoom = M.Modal.getInstance(document.getElementById('modalCreateRoom'))
    this.rootAccess = M.Modal.getInstance(document.getElementById('modalRootAccess'))
  }

  getEl(name) {
    return this[name].$el[0]
  }
}
