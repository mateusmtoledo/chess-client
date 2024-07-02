<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import GamePage from './pages/GamePage.vue';
</script>

<template>
  <div class="grid grid-cols-[240px_1fr] h-screen bg-muted/40">
    <NavBar />
    <main class="p-8">
      <GamePage />
    </main>
  </div>
</template>
