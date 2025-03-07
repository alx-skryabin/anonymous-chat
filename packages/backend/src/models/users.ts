// Интерфейс для объекта пользователя
export interface User {
  id: string
  room: string
  avatar: string
  root: boolean
}

// Хранилище пользователей
const users: User[] = []

export const addUser = (id: string, room: string, avatar: string, root: boolean = false): User => {
  const user: User = {id, room, avatar, root}
  users.push(user)
  return user
}

export const getUser = (id: string): User | undefined => {
  return users.find(user => user.id === id)
}

export const deleteUser = (id: string): User | undefined => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
  return undefined
}

export const getUsers = (room: string): User[] => {
  return users.filter(user => user.room === room && !user.root)
}

export const getAllUsers = (): User[] => {
  return users
}
