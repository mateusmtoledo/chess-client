<script setup lang="ts">
import { useGameHubConnection } from '@/adapters/gameHubConnection';
import ChessBoard from '@/components/ChessBoard.vue';
import GameMenu from '@/components/GameMenu.vue';
import { Chess, Square } from 'chess.js';
import { onMounted, onUnmounted, ref } from 'vue';

const pgn = ref(new Chess().pgn())

function onMove(from: Square, to: Square) {
  const c = new Chess()
  c.loadPgn(pgn.value)
  c.move({ from, to })
  pgn.value = c.pgn()
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

const connection = useGameHubConnection()

function updatePlayersInQueueCount(count: number) {
  playersInQueueCount.value = count
}

onMounted(() => {
  connection.on('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.start().then(() => {
    connection.send('getPlayersInQueueCount')
  })
})

onUnmounted(() => {
  connection.off('playersInQueueCountUpdated', updatePlayersInQueueCount)
  connection.stop()
})
</script>

<template>
  <div class="h-full flex justify-center items-center gap-4">
    <ChessBoard :pgn="pgn" @move="onMove" />
    <GameMenu :pgn="pgn" :playersInQueueCount="playersInQueueCount" :join-queue="joinQueue" :leave-queue="leaveQueue"
      :is-in-queue="isInQueue" />
  </div>
</template>
