<script setup lang="ts">
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuLabel from './ui/dropdown-menu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from './ui/dropdown-menu/DropdownMenuSeparator.vue';
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue';
import Button from './ui/button/Button.vue';
import { UserRound, UserRoundPlus } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import Avatar from './ui/avatar/Avatar.vue';
import AvatarFallback from './ui/avatar/AvatarFallback.vue';
import Skeleton from './ui/skeleton/Skeleton.vue';
import { signOut, useSession } from '@/stores/session';

const session = useSession()

const route = useRoute()

function getUserInitials() {
  if (!session.user) return
  const { user: { name } } = session
  let initials = ''
  const splitName = name.split(' ')
  initials += splitName[0].charAt(0)
  if (splitName[1]) initials += splitName[1].charAt(0)
  return initials
}
</script>

<template>
  <header class="flex justify-between items-center h-14 w-full px-8 py-2">
    <div></div>
    <Skeleton v-if="session.isLoading" class="w-10 h-10 rounded-full" />
    <DropdownMenu v-else-if="session.user != null">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" class="rounded-full text-muted-foreground hover:text-muted-foreground">
          <Avatar class="bg-black text-white">
            <AvatarFallback>{{ getUserInitials() }}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mateus Toledo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="signOut">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button v-else :as-child="true">
      <template v-if="route.path !== '/sign-in'">
        <RouterLink to="/sign-in">
          <UserRound class="w-4 h-4 mr-2" />
          <span>Sign in</span>
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink to="/sign-up">
          <UserRoundPlus class="w-4 h-4 mr-2" />
          <span>Sign up</span>
        </RouterLink>
      </template>
    </Button>
  </header>
</template>
