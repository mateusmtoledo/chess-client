<script setup lang="ts">
import { useGameHubConnection } from '@/adapters/gameHubConnection';
import ChessBoard from '@/components/ChessBoard.vue';
import GameMenu from '@/components/GameMenu.vue';
import PlayerInfo from '@/components/PlayerInfo.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { Game, GameResult } from '@/lib/types/GameTypes';
import { User } from '@/lib/types/SessionTypes';
import { cn } from '@/lib/utils';
import { useSession, withRequiredAuthentication } from '@/stores/session';
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

const joinQueue = withRequiredAuthentication(() => {
  connection.send('joinQueue')
  isInQueue.value = true
})

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

function subscribeToNewGame(game: Game) {
  if (isInQueue.value === false) return
  isInQueue.value = false
  subscribeToGame(game.id)
}

onMounted(() => {
  connection.on('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.on('gameListUpdated', updateGameList)
  connection.on('gameCreated', subscribeToNewGame)
  connection.start().then(() => {
    connection.send('getPlayersInQueueCount')
    connection.send('getAllGames')
  })
})

onUnmounted(() => {
  connection.off('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.off('gameListUpdated', updateGameList)
  connection.off('gameCreated', subscribeToNewGame)
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

const isBoardInverted = computed(() => playerColor.value === 'b')

const topName = computed(() => (isBoardInverted.value ? gameData.value?.whitePlayer.name : gameData.value?.blackPlayer.name) || 'Opponent')

const bottomName = computed(() => (isBoardInverted.value ? gameData.value?.blackPlayer.name : gameData.value?.whitePlayer.name) || 'You')

const currentTurn = computed(() => {
  if (!gameData.value) return null
  const c = new Chess()
  c.loadPgn(gameData.value.pgn)
  return c.turn()
})

const isGameOver = computed(() => {
  if (!gameData.value) return null
  const c = new Chess()
  c.loadPgn(gameData.value.pgn)
  return c.isGameOver()
})

const isTopPlayersTurn = computed(() => isBoardInverted.value ? currentTurn.value === 'w' : currentTurn.value === 'b')
const isBottomPlayersTurn = computed(() => isBoardInverted.value ? currentTurn.value === 'b' : currentTurn.value === 'w')

const gameWinner = computed<User | null>(() => {
  if (gameData.value?.result === GameResult.BlackWins) return gameData.value.blackPlayer
  if (gameData.value?.result === GameResult.WhiteWins) return gameData.value.whitePlayer
  return null
})

const gameWinnerOutlineClasses = cn('outline', 'outline-4', 'outline-green-500')
</script>

<template>
  <div class="h-full flex justify-center items-center gap-4">
    <div class="flex flex-col gap-2">
      <PlayerInfo :name="topName" :turn="!isGameOver && isTopPlayersTurn" />
      <ChessBoard :pgn="pgn" @move="onMove" :player-color="playerColor">
        <template #overlay v-if="gameData && gameData.result !== GameResult.Ongoing">
          <Card class="w-[480px]">
            <CardHeader>
              <CardTitle class="text-center mb-4">
                Match finished
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex mb-8 justify-center items-center gap-8">
                <div class="flex flex-col gap-2 items-center">
                  <div :class="cn('rounded-md', gameData.result === GameResult.WhiteWins && gameWinnerOutlineClasses)">
                    <UserAvatar :name="gameData.whitePlayer.name" :avatar-props="{ shape: 'square', size: 'base' }" />
                  </div>
                  <p class="text-sm text-black/75">{{ gameData.whitePlayer.name }}</p>
                </div>
                <span class="text-sm font-bold">
                  VS
                </span>
                <div class="flex flex-col gap-2 items-center">
                  <div :class="cn('rounded-md', gameData.result === GameResult.BlackWins && gameWinnerOutlineClasses)">
                    <UserAvatar :name="gameData.blackPlayer.name" :avatar-props="{ shape: 'square', size: 'base' }" />
                  </div>
                  <p class="text-sm text-black/75">{{ gameData.blackPlayer.name }}</p>
                </div>
              </div>
              <p class="text-center font-medium">
                {{ gameData.result === GameResult.Draw ? 'It\'s a draw' : `${gameWinner?.name} won` }}
              </p>
            </CardContent>
          </Card>
        </template>
      </ChessBoard>
      <PlayerInfo :name="bottomName" :turn="!isGameOver && isBottomPlayersTurn" />
    </div>
    <GameMenu :pgn="pgn" :playersInQueueCount="playersInQueueCount" :join-queue="joinQueue" :leave-queue="leaveQueue"
      :is-in-queue="isInQueue" :all-games="allGames" :subscribe-to-game="subscribeToGame" />
  </div>
</template>
