export interface User {
  id: number;
  name: string;
}

export const greet = (user: User): string => `Hello, ${user.name}!`;
