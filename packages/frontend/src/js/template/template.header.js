const title = () => {
  return `
    <h1><i class="fas fa-ghost"></i> Anonymous Сhat</h1>
  `
}

const menuBtn = () => {
  return `
    <a href="#" class="sidenav-trigger waves-effect waves-light" data-target="slide-out">
      <i class="fas fa-sliders-h"></i> Menu
    </a>
  `
}

const menuSidenav = () => {
  return `
    <ul id="slide-out" class="sidenav">
      <li>
        <div class="user-view">
          <div class="background">
            <img src="https://static.tildacdn.com/tild6337-6165-4433-a135-366466326266/-/resize/504x/hightechImage.png" alt="bg">
          </div>
          <img class="circle" alt="avatar" src="">
        </div>
      </li>
      <li><a href="#modalCreateRoom" class="modal-trigger"><i class="fas fa-plus"></i> Create room</a></li>
      <li><a href="#modalUserKick" class="modal-trigger"><i class="fas fa-crosshairs"></i> Kick out user</a></li>
      <li><a href="#modalListRoom" class="modal-trigger"><i class="far fa-comments"></i> List rooms</a></li>
      <li><div class="divider"></div></li>
      <li><a href="#modalRootAccess" class="modal-trigger"><i class="fas fa-fingerprint"></i> I am root</a></li>
    </ul>
  `
}

const feedback = () => {
  return `
    <div class="feedback">
      <span><i class="fas fa-code-branch"></i> Improvements? — </span>
      <a href="https://github.com/alx-skryabin/anonymous-chat" target="_blank">github</a>
    </div>
  `
}

const header = () => {
  return `
    <div class="header">
      ${menuBtn()}
      ${title()}
      ${feedback()}
      ${menuSidenav()}
    </div>
  `
}

export {header}
