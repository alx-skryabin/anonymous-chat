const modalCreateRoom = () => {
  return `
    <div id="modalCreateRoom" class="modal">
      <div class="modal-content">
        <h5><i class="fas fa-plus"></i> Create your own room</h5>
        <form>
          <div class="input-field">
            <input id="roomName" type="text" name="name" autocomplete="off">
            <label for="roomName">Name</label>
          </div>
          <div class="input-field">
            <input id="roomPass" type="password" name="pass" disabled>
            <label for="roomPass">Password</label>
          </div>
          <label>
            <input type="checkbox" name="isPrivate"/>
            <span>Private room</span>
          </label>
          <div class="modal-tips"></div>
        </form>
      </div>
      <div class="modal-footer">
        <a href="#" class="waves-effect btn-flat">Create</a>
      </div>
    </div>
  `
}

const modalRoot = () => {
  return `
    <div id="modalRootAccess" class="modal">
      <div class="modal-content">
        <h5><i class="fas fa-fingerprint"></i> Root access</h5>
        <form id="formRoot" style="margin-top: 50px;">
          <div class="input-field">
          <input id="rootPass" type="password">
          <label class="active" for="rootPass">Root password</label>
        </div>
        </form>
      </div>
    </div>
  `
}

const modalListRoom = () => {
  return `
    <div id="modalListRoom" class="modal bottom-sheet">
      <div class="modal-content">
        <h5><i class="far fa-comments"></i> List rooms</h5>
        <div class="list-rooms"></div>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Close</a>
      </div>
    </div>
  `
}

const modalUserKick = () => {
  return `
    <div id="modalUserKick" class="modal bottom-sheet">
      <div class="modal-content">
        <h5><i class="fas fa-crosshairs"></i> Kick out user</h5>
        <p>Select a user to start voting on his expulsion <i class="fas fa-bomb"></i></p>
        <div class="list-users"></div>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Close</a>
      </div>
    </div>
  `
}

const modalVotingKick = () => {
  return `
    <div id="modalVotingKick" class="modal">
      <div class="modal-content">
        <h5><i class="fas fa-gavel"></i> Voting kick</h5>
        <p class="center-align">Make your choice!</p>
        <div class="voting-box">
          <div class="dislike pulse" data-voting="dislike">
            <i class="fas fa-heart-broken" data-voting="dislike"></i>
          </div>
          <img src="" alt="user">
          <div class="like pulse" data-voting="like">
            <i class="fas fa-heart" data-voting="like"></i>
          </div>
        </div>
        <div class="progress">
          <div class="determinate" style="width: 100%"></div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Close</a>
      </div>
    </div>
  `
}

const modalVotingResult = () => {
  return `
    <div id="modalVotingResult" class="modal">
      <div class="modal-content">
        <h5 class="center-align">Voting result</h5>
        <div class="voting-box voting-box-result"></div>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect btn-flat">Close</a>
      </div>
    </div>
  `
}

const modals = () => {
  return `
     ${modalCreateRoom()}
     ${modalRoot()}
     ${modalListRoom()}
     ${modalUserKick()}
     ${modalVotingKick()}
     ${modalVotingResult()}
  `
}

export {modals}
