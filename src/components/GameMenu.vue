<script setup lang="ts">
import { Loader2, Search, UsersRound, X } from 'lucide-vue-next'
import Button from './ui/button/Button.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardHeader from './ui/card/CardHeader.vue'
import CardFooter from './ui/card/CardFooter.vue'
import Tabs from './ui/tabs/Tabs.vue'
import TabsContent from './ui/tabs/TabsContent.vue'
import TabsList from './ui/tabs/TabsList.vue'
import TabsTrigger from './ui/tabs/TabsTrigger.vue'
import MoveList from './MoveList.vue'
import { computed, ref, watch } from 'vue'
import { useInterval } from '@vueuse/core'
import { cn } from '@/lib/utils'

type GameMenuProps = {
  pgn: string
  playersInQueueCount: number
  isInQueue: boolean
  joinQueue: () => void
  leaveQueue: () => void
}

const props = defineProps<GameMenuProps>()

const isHoveringLeaveQueueButton = ref(false)

const { counter, reset, pause, resume } = useInterval(1000, { controls: true, immediate: false })

const timeInQueue = computed(() => {
  const minutes = Math.floor(counter.value / 60)
  const seconds = counter.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

watch(() => props.isInQueue, (isInQueue, oldValue) => {
  if (isInQueue === oldValue) return
  reset()
  if (isInQueue) resume()
  else pause()
})

const buttonCommonClasses = cn("w-full", "mb-4", "flex", "gap-2")
const iconCommonClasses = cn("w-4", "h-4")
</script>

<template>
  <Tabs default-value="new-game" class="h-full">
    <Card class="h-full min-w-72 flex flex-col">
      <CardHeader class="p-0">
        <TabsList class="grid grid-cols-2">
          <TabsTrigger value="new-game">New game</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent class="flex-1 pt-6">
        <TabsContent value="new-game">
          <Button v-if="isInQueue" variant="outline"
            :class="cn(buttonCommonClasses, isHoveringLeaveQueueButton && '!text-destructive !border-destructive')"
            @click="props.leaveQueue" @mouseover="() => isHoveringLeaveQueueButton = true"
            @mouseleave="() => isHoveringLeaveQueueButton = false">
            <X v-if="isHoveringLeaveQueueButton" :class="iconCommonClasses" />
            <Loader2 v-else :class="cn(iconCommonClasses, 'animate-spin')" />
            {{ isHoveringLeaveQueueButton ? `Leave queue (${timeInQueue})` : `Searching (${timeInQueue})` }}
          </Button>
          <Button v-else :class="buttonCommonClasses" @click="props.joinQueue">
            <Search :class="iconCommonClasses" />
            Find a match
          </Button>
          <div class="flex gap-2 justify-center items-center">
            <UsersRound :size="18" />
            <p class="text-center">{{ playersInQueueCount }} player{{ playersInQueueCount !== 1 ? 's' : '' }} in
              queue
            </p>
          </div>
        </TabsContent>
        <TabsContent value="matches">
        </TabsContent>
      </CardContent>
      <CardFooter>
        <MoveList :pgn="props.pgn" />
      </CardFooter>
    </Card>
  </Tabs>
</template>
