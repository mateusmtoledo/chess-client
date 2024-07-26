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
import Skeleton from './ui/skeleton/Skeleton.vue';
import { signOut, useSession } from '@/stores/session';
import UserAvatar from './UserAvatar.vue';

const session = useSession()

const route = useRoute()
</script>

<template>
  <header class="flex justify-between items-center h-14 w-full px-8 py-2">
    <div></div>
    <Skeleton v-if="session.isLoading" class="w-10 h-10 rounded-full" />
    <DropdownMenu v-else-if="session.user != null">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" class="rounded-full text-muted-foreground hover:text-muted-foreground">
          <UserAvatar :name="session.user.name" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{{ session.user.name }}</DropdownMenuLabel>
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
