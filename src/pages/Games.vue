<script setup lang="ts">
import ChessBoard from '@/components/ChessBoard.vue';
import GameMenu from '@/components/GameMenu.vue';
import { Chess, Square } from 'chess.js';
import { ref } from 'vue';

const pgn = ref(new Chess().pgn())

function onMove(from: Square, to: Square) {
  const c = new Chess()
  c.loadPgn(pgn.value)
  c.move({ from, to })
  pgn.value = c.pgn()
}
</script>

<template>
  <div class="flex gap-4">
    <ChessBoard :pgn="pgn" @move="onMove" />
    <GameMenu :pgn="pgn" :playersInQueueCount="0" />
  </div>
</template>
