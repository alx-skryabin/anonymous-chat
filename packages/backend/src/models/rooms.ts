// Интерфейс для объекта комнаты
export interface Room {
  name: string
  password: string | false // Пароль может быть строкой или false
}

// Статические комнаты (не подлежат удалению)
const staticRooms: string[] = ['free', 'sk']

// Хранилище комнат
const rooms: Room[] = [
  {name: 'free', password: false}, // default room
  {name: 'sk', password: '20'} // exp: private room
]

export const addRoom = (name: string, password: string | false): Room => {
  const room: Room = {name, password}
  rooms.push(room)
  return room
}

export const getRoom = (name: string): Room | undefined => {
  return rooms.find(room => room.name === name)
}

export const deleteRoom = (name: string): Room | undefined => {
  if (staticRooms.includes(name)) {
    console.log(`can't delete ${name} room`)
    return undefined
  }
  const index = rooms.findIndex(room => room.name === name)
  if (index !== -1) return rooms.splice(index, 1)[0]
  return undefined
}

export const getAllRooms = (): Room[] => {
  return rooms
}
