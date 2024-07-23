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
  <div class="flex h-screen bg-muted/40">
    <NavBar />
    <div class="w-full flex flex-col">
      <Header />
      <main class="flex-1 p-8 min-h-0">
        <RouterView />
      </main>
    </div>
  </div>
</template>
