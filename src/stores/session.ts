import api from "@/adapters/api";
import { Session, UserCredentials } from "@/lib/types/SessionTypes";
import { reactive, readonly } from "vue";

const session = reactive<Session>({
  user: null,
  isLoading: true,
})

let callbackQueue: (() => void)[] = []

function executeCallbacks() {
  callbackQueue.forEach((callback) => callback())
  callbackQueue = []
}

export async function signIn(credentials: UserCredentials) {
  const response = await api.post('/auth/signin', credentials)
  const accessToken = response.data.token
  localStorage.setItem('accessToken', accessToken)
  // TODO This is to make sure everything goes well,
  // but it could be a better solution to just restart
  // the signalr connection.
  location.reload()
  // fetchSession()
}

export async function fetchSession() {
  session.isLoading = true
  try {
    if (localStorage.getItem('accessToken')) {
      const response = await api.get('/auth/info')
      session.user = response.data
      session.isLoading = false
      executeCallbacks()
    }
  } catch (err) {
    localStorage.removeItem('accessToken')
    // TODO This is to make sure everything goes well,
    // but it could be a better solution to just restart
    // the signalr connection.
    location.reload()
    throw err;
  } finally {
    session.isLoading = false
  }
}

export function signOut() {
  localStorage.removeItem('accessToken')
  // session.user = null
  // session.isLoading = false
  // TODO This is to make sure everything goes well,
  // but it could be a better solution to just restart
  // the signalr connection.
  location.reload()
}

export function withRequiredAuthentication(callback: () => void) {
  return () => {
    if (session.isLoading) callbackQueue.push(callback)
    else if (session.user === null) location.replace('/sign-in')
    else callback()
  }
}

export function useSession() {
  return readonly(session)
}

