<script setup lang="ts">
import { Puzzle, Settings, Swords, User } from 'lucide-vue-next';
import NavLink from './NavLink.vue';
</script>

<template>
  <div class="bg-background border-r border-border flex flex-col justify-between p-4 w-[240px]">
    <div>
      <h1 class="text-3xl font-extrabold m-4">
        <RouterLink to="/">
          MChess
        </RouterLink>
      </h1>
      <nav className="flex flex-col gap-2">
        <NavLink text="Profile" :icon="User" />
        <NavLink text="Games" :icon="Swords" />
        <NavLink text="Puzzles" :icon="Puzzle" />
        <NavLink text="Settings" :icon="Settings" />
      </nav>
    </div>
    <div>
    </div>
  </div>
</template>
