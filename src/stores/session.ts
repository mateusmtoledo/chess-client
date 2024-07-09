import api from "@/adapters/api";
import { reactive, readonly } from "vue";

export type User = {
  name: string;
}

export type UserCredentials = {
  name: string
  password: string
}

type Session = {
  user: User | null
  isLoading: boolean
}

const session = reactive<Session>({
  user: null,
  isLoading: true,
})

export async function signIn(credentials: UserCredentials) {
  const response = await api.post('/auth/signin', credentials)
  const accessToken = response.data.token
  localStorage.setItem('accessToken', accessToken)
  fetchSession()
}

export async function fetchSession() {
  session.isLoading = true
  try {
    if (localStorage.getItem('accessToken')) {
      const response = await api.get('/auth/info')
      session.user = response.data
    }
  } catch (err) {
    localStorage.removeItem('accessToken')
    throw err;
  } finally {
    session.isLoading = false
  }
}

export function signOut() {
  localStorage.removeItem('accessToken')
  session.user = null
  session.isLoading = false
}

export function useSession() {
  return readonly(session)
}

