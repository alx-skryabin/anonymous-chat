import {User} from '@anonymous-chat/shared'

// Хранилище пользователей
const users: User[] = []

/**
 * Добавляет нового пользователя в систему.
 * @param params Объект с параметрами пользователя
 * @returns Объект добавленного пользователя
 */
export const addUser = (params: User): User => {
  const user: User = {
    id: params.id,
    room: params.room,
    avatar: params.avatar,
    root: params.root ?? false
  }

  users.push(user)
  return user
}

/**
 * Находит пользователя по идентификатору.
 * @param id Идентификатор искомого пользователя
 * @returns Найденный пользователь или null, если пользователь не найден
 */
export const getUser = (id: string): User | null => {
  const user = users.find(user => user.id === id)
  return user || null
}

/**
 * Удаляет пользователя по идентификатору.
 * @param id Идентификатор пользователя для удаления
 * @returns Удаленный пользователь или null, если пользователь не найден
 */
export const deleteUser = (id: string): User | null => {
  const index = users.findIndex(user => user.id === id)

  if (index === -1) {
    return null
  }

  const [removedUser] = users.splice(index, 1)
  return removedUser
}

/**
 * Получает список пользователей в указанной комнате, исключая root-пользователей.
 * @param room Идентификатор комнаты
 * @returns Массив пользователей, находящихся в указанной комнате и не имеющих прав root
 */
export const getUsers = (room: string): User[] => {
  return users.filter(user => user.room === room && !user.root)
}

/**
 * Возвращает список всех пользователей системы.
 * @returns Полный массив пользователей
 */
export const getAllUsers = (): User[] => {
  return [...users]
}
