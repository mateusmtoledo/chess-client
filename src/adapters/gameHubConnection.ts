import { HubConnectionBuilder } from '@microsoft/signalr'
import { shallowReactive } from 'vue'

const connection = shallowReactive(new HubConnectionBuilder()
  .withUrl(
    new URL('gamehub', import.meta.env.VITE_API_URL).toString(),
    {
      accessTokenFactory: () => (localStorage.getItem('accessToken') || '')
    }
  )
  .build()
)

// type ConnectionState = {
//   status: 'disconnected' | 'connected' | 'connecting'
// }
//
// const state = reactive<ConnectionState>({
//   status: 'disconnected'
// })
//
// connection.onreconnected(() => {
//   state.status = 'connected'
// })
//
// connection.onclose(() => {
//   state.status = 'disconnected'
// })
//
// connection.onreconnecting(() => {
//   state.status = 'connecting'
// })

export function useGameHubConnection() {
  return connection
}

