<script setup lang="ts">
import { Chess } from 'chess.js';
import { computed, ref, watch } from 'vue';
import ScrollArea from './ui/scroll-area/ScrollArea.vue';

type MoveListProps = {
  pgn: string
}

const props = defineProps<MoveListProps>()

const moveRefs = ref()

watch(() => moveRefs.value?.[moveRefs.value.length - 1], (lastMoveElement) => {
  if (!lastMoveElement) return
  lastMoveElement.scrollIntoView()
})

const moveList = computed(() => {
  const c = new Chess()
  c.loadPgn(props.pgn)
  const history = c.history()
  const _moveList: Array<[string, string?]> = []
  history.forEach((move, i) => {
    if (i % 2 === 0) _moveList.push([move])
    else _moveList[_moveList.length - 1].push(move)
  })
  return _moveList
})
</script>


<template>
  <ScrollArea class="h-48 w-full" id="move-list-scroll-area">
    <ol>
      <li v-for="(move, index) in moveList" ref="moveRefs">
        <p class="flex w-full">
          <span class="w-12 text-muted-foreground">{{ index + 1 }}.</span>
          <span class="w-24">{{ move[0] }}</span>
          <span v-if="move[1]">{{ move[1] }}</span>
        </p>
      </li>
    </ol>
  </ScrollArea>
</template>
