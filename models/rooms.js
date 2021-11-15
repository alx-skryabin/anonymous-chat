const staticRooms = ['free', 'sk']

const rooms = [
  {name: 'free', password: false}, // default room
  {name: 'sk', password: '20'} // exp: private room
]

const addRoom = (name, password) => {
  rooms.push({name, password})
  return {name, password}
}

const getRoom = name => {
  return rooms.find(room => room.name === name)
}

const deleteRoom = name => {
  if (staticRooms.includes(name)) return console.log(`can't delete ${name} room`)
  const index = rooms.findIndex(room => room.name === name)
  if (index !== -1) return rooms.splice(index, 1)[0]
}

const getAllRooms = () => rooms

module.exports = {addRoom, getRoom, deleteRoom, getAllRooms}
