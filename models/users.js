const users = []

const addUser = (id, room, avatar) => {
  const user = {id, room, avatar}
  users.push(user)
  return user
}

const getUser = id => {
  return users.find(user => user.id === id)
}

const deleteUser = id => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}

const getUsers = room => users.filter(user => user.room === room)

const getAllUsers = () => users

module.exports = {addUser, getUser, deleteUser, getUsers, getAllUsers}
