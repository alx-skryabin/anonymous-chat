export class Modals {
  constructor() {
    this.createRoom = null
    this.rootAccess = null
    this.listRoom = null
    this.userKick = null
    this.votingKick = null
    this.votingResult = null

    this.init()
  }

  init() {
    this.createRoom = M.Modal.getInstance(document.getElementById('modalCreateRoom'))
    this.rootAccess = M.Modal.getInstance(document.getElementById('modalRootAccess'))
    this.listRoom = M.Modal.getInstance(document.getElementById('modalListRoom'))
    this.userKick = M.Modal.getInstance(document.getElementById('modalUserKick'))
    this.votingKick = M.Modal.getInstance(document.getElementById('modalVotingKick'))
    this.votingResult = M.Modal.getInstance(document.getElementById('modalVotingResult'))
  }
}
