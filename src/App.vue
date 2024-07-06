<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { fetchSession } from './stores/session';

onMounted(async () => {
  await fetchSession()
})
</script>

<template>
  <div class="grid grid-cols-[240px_1fr] h-screen bg-muted/40">
    <NavBar />
    <div class="flex flex-col">
      <Header />
      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
