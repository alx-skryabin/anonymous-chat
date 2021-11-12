const rooms = [
  {name: 'free', password: false}, // default room
  {name: 'zelek', password: '12345'} // test private room
]

const addRoom = (name, password) => {
  rooms.push({name, password})
  return {name, password}
}

const getRoom = name => {
  return rooms.find(room => room.name === name)
}

const deleteRoom = name => {
  const index = rooms.findIndex(room => room.name === name)
  if (index !== -1) return rooms.splice(index, 1)[0]
}

module.exports = {addRoom, getRoom, deleteRoom}
