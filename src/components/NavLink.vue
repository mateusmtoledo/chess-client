<script setup lang="ts">
import { LucideIcon } from 'lucide-vue-next';
import { Button } from './ui/button';

type NavLinkProps = {
  icon: LucideIcon
  text: string
}

const props = defineProps<NavLinkProps>()
</script>

<template>
  <Button variant="ghost" class="flex gap-2">
    <component :is="props.icon" />
    <p class="w-full text-left">{{ props.text }}</p>
  </Button>
</template>
