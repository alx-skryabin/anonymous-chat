const {getUser} = require('../models/users')

const TIME_VOTING = 20
const voting = new Map()

class KickVoting {
  constructor(user, io) {
    this.user = user
    this.io = io
    this.prepare()
  }

  prepare() {
    voting.set(this.user.room, {d: 0, l: 0})
    this.countdown()
  }

  countdown() {
    setTimeout(() => {
      console.log('end voting: ' + this.user.room)
      this.sendResult()
      voting.delete(this.user.room)
    }, TIME_VOTING * 1000)
  }

  sendResult() {
    this.io.in(this.user.id).emit('VOTING_FINISH', voting.get(this.user.room))

    this.io.in(this.user.room).emit('VOTING_RESULT', {
      result: voting.get(this.user.room),
      avatar: this.user.avatar
    })
  }
}


function kick(io, socket) {
  socket.on('VOTING_INIT', ({id}) => {
    const user = getUser(id)
    let allowVoting = false

    if (!voting.has(user.room)) {
      new KickVoting(user, io)
      allowVoting = true
    }

    const recipient = allowVoting ? user.room : socket.id

    io.in(recipient).emit('VOTING_INIT', {
      room: user.room,
      avatar: user.avatar,
      allowVoting,
      time: TIME_VOTING
    })
  })

  socket.on('VOTING_POINT', ({value, room}) => {
    const res = voting.get(room)
    const {d, l} = res

    if (value === 'dislike') res.d = d + 1
    if (value === 'like') res.l = l + 1

    voting.set(room, res)
  })
}

module.exports = {kick}
