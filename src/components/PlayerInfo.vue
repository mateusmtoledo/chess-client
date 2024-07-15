<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import { AvatarVariants } from './ui/avatar';
import Badge from './ui/badge/Badge.vue';

type PlayerInfoProps = {
  name: string
  turn: boolean
}

const props = defineProps<PlayerInfoProps>()

const avatarProps: AvatarVariants = {
  shape: 'square'
}
</script>

<template>
  <div class="flex w-full justify-between items-center">
    <div class="flex items-center gap-2">
      <UserAvatar :name="props.name" :avatar-props="avatarProps" />
      <span>
        {{ props.name }}
      </span>
    </div>
    <Badge v-if="props.turn" variant="outline" class="h-max">Playing</Badge>
  </div>
</template>
