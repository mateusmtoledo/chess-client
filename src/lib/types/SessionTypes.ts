export type User = {
  id: string;
  name: string;
}

export type UserCredentials = {
  name: string
  password: string
}

export type Session = {
  user: User | null
  isLoading: boolean
}

