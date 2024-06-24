<script setup lang="ts">
import { UsersRound } from 'lucide-vue-next'
import Button from './ui/button/Button.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardHeader from './ui/card/CardHeader.vue'
import CardFooter from './ui/card/CardFooter.vue'
import Tabs from './ui/tabs/Tabs.vue'
import TabsContent from './ui/tabs/TabsContent.vue'
import TabsList from './ui/tabs/TabsList.vue'
import TabsTrigger from './ui/tabs/TabsTrigger.vue'
import { computed } from 'vue'
import { Chess } from 'chess.js'
import ScrollArea from './ui/scroll-area/ScrollArea.vue'

type GameMenuProps = {
  pgn: string
  playersInQueueCount: number
}

const props = defineProps<GameMenuProps>()

const moveHistory = computed(() => {
  const c = new Chess()
  c.loadPgn(props.pgn)
  return c.history()
})
</script>

<template>
  <Tabs default-value="new-game">
    <Card class="h-full min-w-72 flex flex-col">
      <CardHeader class="p-0">
        <TabsList class="grid grid-cols-2">
          <TabsTrigger value="new-game">New game</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>
      </CardHeader>
      <CardContent class="flex-1 pt-6">
        <TabsContent value="new-game">
          <Button class="w-full mb-4">Find a match</Button>
          <div class="flex gap-2 justify-center items-center">
            <UsersRound :size="18" />
            <p class="text-center">{{ playersInQueueCount }} player{{ playersInQueueCount !== 1 ? 's' : '' }} in queue
            </p>
          </div>
        </TabsContent>
        <TabsContent value="matches">
        </TabsContent>
      </CardContent>
      <CardFooter>
        <ScrollArea class="h-48 w-full">
          <ol>
            <li v-for="n in Math.floor((moveHistory.length + 1) / 2)">
              <p class="flex w-full">
                <span class="w-12 text-muted-foreground">{{ n }}.</span>
                <span class="w-24">{{ moveHistory[(n - 1) * 2] }}</span>
                <span v-if="moveHistory[(n - 1) * 2 + 1]">{{ moveHistory[(n - 1) * 2 + 1] }}</span>
              </p>
            </li>
          </ol>
        </ScrollArea>
      </CardFooter>
    </Card>
  </Tabs>
</template>
