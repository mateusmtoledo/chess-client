<script setup lang="ts">
import { Loader2, Search, Swords, UsersRound, X } from 'lucide-vue-next'
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
import Badge from './ui/badge/Badge.vue'
import { Game, GameResult } from '@/lib/types/GameTypes'
import ScrollArea from './ui/scroll-area/ScrollArea.vue'

type GameMenuProps = {
  pgn: string
  playersInQueueCount: number
  isInQueue: boolean
  joinQueue: () => void
  leaveQueue: () => void
  allGames: Game[]
  subscribeToGame: (gameId: number) => void
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

const sortedGames = computed(() => [...props.allGames].sort((a, b) => {
  if (a.result === b.result) return 0
  else if (a.result === GameResult.Ongoing) return -1
  else if (b.result === GameResult.Ongoing) return 1
  else return 0
}))

const buttonCommonClasses = cn("w-full", "mb-4", "flex", "gap-2")
const iconCommonClasses = cn("w-4", "h-4")
</script>

<template>
  <Tabs default-value="new-game" class="h-full">
    <Card class="min-w-72 flex flex-col h-full flex-1 !p-0">
      <CardHeader class="p-0">
        <TabsList class="grid grid-cols-2">
          <TabsTrigger value="new-game">New game</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent class="flex-1 min-h-0 p-0">
        <ScrollArea class="h-full">
          <TabsContent value="new-game" class="p-6">
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
          <TabsContent value="matches" class="mt-0">
            <ul class="flex flex-col">
              <Button variant="ghost" v-for="game in sortedGames" @click="() => subscribeToGame(game.id)"
                class="h-max p-0 rounded-none border-t border-border">
                <div class="w-full flex justify-between items-center px-5 py-4">
                  <div class="flex gap-2 items-center">
                    <Swords class="w-5 h-5 text-muted-foreground" />
                    <div class="flex flex-col">
                      <span :class="game.result === GameResult.WhiteWins ? 'font-semibold' : 'text-muted-foreground'">
                        {{ game.whitePlayer.name }}
                      </span>
                      <span :class="game.result === GameResult.BlackWins ? 'font-semibold' : 'text-muted-foreground'">
                        {{ game.blackPlayer.name }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Badge :variant="game.result === GameResult.Ongoing ? 'outline' : 'default'">{{ game.result ===
                      GameResult.Ongoing ? 'Ongoing' : 'Finished' }}</Badge>
                  </div>
                </div>
              </Button>
            </ul>
          </TabsContent>
        </ScrollArea>
      </CardContent>
      <CardFooter class="border-t border-border pt-3">
        <MoveList :pgn="props.pgn" />
      </CardFooter>
    </Card>
  </Tabs>
</template>
