<script setup lang="ts">
import Avatar from './ui/avatar/Avatar.vue';
import AvatarFallback from './ui/avatar/AvatarFallback.vue';
import { computed } from 'vue';
import { AvatarVariants } from './ui/avatar';

type UserAvatarProps = {
  name: string
  avatarProps?: AvatarVariants
}

const props = defineProps<UserAvatarProps>()

function getUserInitials(name: string) {
  let initials = ''
  const splitName = name.split(' ')
  initials += splitName[0].charAt(0)
  if (splitName[1]) initials += splitName[1].charAt(0)
  return initials.toUpperCase()
}

const fallback = computed(() => getUserInitials(props.name))
</script>

<template>
  <Avatar class="bg-black text-white" v-bind="props.avatarProps">
    <AvatarFallback>
      {{ fallback }}
    </AvatarFallback>
  </Avatar>
</template>
