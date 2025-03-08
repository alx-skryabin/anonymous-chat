// Интерфейс для объекта комнаты
export interface Room {
  name: string
  password: string | false // Пароль может быть строкой или false
}

// Интерфейс для объекта пользователя
export interface User {
  id: string
  room: string
  avatar: string
  root: boolean
}

export interface VotingResultData {
  avatar: string
  result: {
    d: number
    l: number
  }
}
