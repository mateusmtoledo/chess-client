<script setup lang="ts">
import { Puzzle, Settings, Swords, User } from 'lucide-vue-next';
import NavLink from './components/NavLink.vue';
import ChessBoard from './components/ChessBoard.vue';
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
  <div class="grid grid-cols-[240px_1fr] h-screen">
    <div class="bg-background border-r border-border flex flex-col gap-4 p-4">
      <h1 class="text-3xl font-extrabold">
        MChess
      </h1>
      <nav className="flex flex-col gap-2">
        <NavLink text="Profile" :icon="User" />
        <NavLink text="Games" :icon="Swords" />
        <NavLink text="Puzzles" :icon="Puzzle" />
        <NavLink text="Settings" :icon="Settings" />
      </nav>
    </div>
    <main class="p-8">
      <ChessBoard :pgn="pgn" @move="onMove" />
    </main>
  </div>
</template>
