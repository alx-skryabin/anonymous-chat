import {CHAT} from '../configs/chat'

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
  {name: 'sk', password: CHAT.PASS_ROOM_STATIC} // exp: private room
]

/**
 * Добавляет новую комнату в систему.
 * @param params Объект с параметрами комнаты
 * @returns Объект добавленной комнаты
 */
export const addRoom = (params: Room): Room => {
  const room: Room = {
    name: params.name,
    password: params.password
  }

  rooms.push(room)
  return room
}

/**
 * Находит комнату по её названию.
 * @param name Имя комнаты поиска
 * @returns Найденная комната или null, если комната не найдена
 */
export const getRoom = (name: string): Room | null => {
  const room = rooms.find(room => room.name === name)
  return room || null
}

/**
 * Удаляет комнату по её названию.
 * @param name Имя комнаты поиска
 * @returns Удаленная комната или null, если комната не найдена
 */
export const deleteRoom = (name: string): Room | null => {
  if (staticRooms.includes(name)) {
    console.log(`can't delete ${name} room`)
    return null
  }
  const index = rooms.findIndex(room => room.name === name)
  if (index !== -1) return rooms.splice(index, 1)[0]
  return null
}

/**
 * Возвращает список всех комнат системы.
 * @returns Полный массив комнат
 */
export const getAllRooms = (): Room[] => {
  return [...rooms]
}
