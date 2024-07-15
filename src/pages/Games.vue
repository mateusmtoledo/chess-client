<script setup lang="ts">
import { useGameHubConnection } from '@/adapters/gameHubConnection';
import ChessBoard from '@/components/ChessBoard.vue';
import GameMenu from '@/components/GameMenu.vue';
import { Game } from '@/lib/types/GameTypes';
import { useSession } from '@/stores/session';
import { Chess, Square } from 'chess.js';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const connection = useGameHubConnection()

const defaultPgn = new Chess().pgn()
const gameData = ref<Game | null>(null)

const pgn = computed(() => gameData.value?.pgn || defaultPgn)

const isGameLoading = ref(false)
const subscribedTo = ref<number | null>(null)

function isRelatedEvent(gameId: number) {
  return subscribedTo.value !== null && gameId === subscribedTo.value
}

function subscribeToGame(gameId: number) {
  if (subscribedTo.value === gameId) return
  if (subscribedTo.value !== null) connection.send('unsubscribeFromGame', subscribedTo.value)
  subscribedTo.value = gameId
  isGameLoading.value = true
  gameData.value = null
  connection.send('subscribeToGame', gameId)
}

connection.on('pgnUpdated', (gameId: number, newPgn: string) => {
  if (!isRelatedEvent(gameId) || gameData.value === null) return
  gameData.value.pgn = newPgn
})

connection.on('gameDataUpdated', (newGameData: Game) => {
  if (!isRelatedEvent(newGameData.id)) return
  isGameLoading.value = false
  gameData.value = newGameData
})

function onMove(from: Square, to: Square) {
  if (subscribedTo.value === null || gameData.value === null) return
  const c = new Chess()
  c.loadPgn(pgn.value)
  try {
    c.move({ from, to })
    connection.send('playMove', subscribedTo.value, from, to)
    gameData.value.pgn = c.pgn()
  } catch (err) {
    console.log(err)
  }
}

const playersInQueueCount = ref(0)
const isInQueue = ref<boolean>(false)

function joinQueue() {
  connection.send('joinQueue')
  isInQueue.value = true
}

function leaveQueue() {
  connection.send('leaveQueue')
  isInQueue.value = false
}

function updatePlayersInQueueCount(count: number) {
  playersInQueueCount.value = count
}

const allGames = ref<Game[]>([])

function updateGameList(games: Game[]) {
  allGames.value = games
}

onMounted(() => {
  connection.on('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.on('gameListUpdated', updateGameList)
  connection.start().then(() => {
    connection.send('getPlayersInQueueCount')
    connection.send('getAllGames')
  })
})

onUnmounted(() => {
  connection.off('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.stop()
})

const session = useSession()

const playerColor = computed(() => {
  const { user } = session
  if (!gameData.value || !user) return null
  if (gameData.value.whitePlayer.id === user.id) return 'w'
  if (gameData.value.blackPlayer.id === user.id) return 'b'
  return null
})
</script>

<template>
  <div class="h-full flex justify-center items-center gap-4">
    <ChessBoard :pgn="pgn" @move="onMove" :player-color="playerColor" />
    <GameMenu :pgn="pgn" :playersInQueueCount="playersInQueueCount" :join-queue="joinQueue" :leave-queue="leaveQueue"
      :is-in-queue="isInQueue" :all-games="allGames" :subscribe-to-game="subscribeToGame" />
  </div>
</template>
