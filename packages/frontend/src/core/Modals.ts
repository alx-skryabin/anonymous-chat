import M, {Modal} from 'materialize-css'

export class Modals {
  public createRoom: Modal
  public rootAccess: Modal
  public listRoom: Modal
  public userKick: Modal
  public votingKick: Modal
  public votingResult: Modal

  constructor() {
    const getModal = (id: string): Modal => {
      const element = document.getElementById(id)
      if (!element) {
        throw new Error(`Modal element with ID "${id}" not found in the DOM`)
      }
      const modal = M.Modal.getInstance(element)
      if (!modal) {
        throw new Error(`Failed to initialize Modal for element with ID "${id}"`)
      }
      return modal
    }

    this.createRoom = getModal('modalCreateRoom')
    this.rootAccess = getModal('modalRootAccess')
    this.listRoom = getModal('modalListRoom')
    this.userKick = getModal('modalUserKick')
    this.votingKick = getModal('modalVotingKick')
    this.votingResult = getModal('modalVotingResult')
  }
}
