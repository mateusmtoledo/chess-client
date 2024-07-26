<script setup lang="ts">
import pieces from '@/assets/pieces'
import { Chess, SQUARES, type Piece, type Square } from 'chess.js'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

type ChessBoardProps = {
  pgn: string
  onMove: (from: Square, to: Square) => void
  playerColor: 'w' | 'b' | null
}

const props = defineProps<ChessBoardProps>()

const mousePosition = reactive({
  x: 0,
  y: 0
})

const boardRef = ref({} as HTMLDivElement)

function onMouseMove(e: MouseEvent) {
  const rect = boardRef.value.getBoundingClientRect()
  mousePosition.x = Math.min(rect.right, Math.max(rect.left, e.x))
  mousePosition.y = Math.min(rect.bottom, Math.max(rect.top, e.y))
}

const chess = computed(() => {
  const c = new Chess()
  c.loadPgn(props.pgn)
  return c
})

const moving = ref<Square | null>(null)

function isMovingOwnPiece() {
  const m = moving.value
  if (!m) return false
  const piece = chess.value.get(m)
  if (!piece || piece.color !== props.playerColor) return false
  return true
}

function getPieceUrl(piece: Piece) {
  if (!piece) return
  const { type, color } = piece
  return pieces[color.toLowerCase() + type.toUpperCase()]
}

function getSquareFromEvent(e: MouseEvent) {
  const boardRect = boardRef.value.getBoundingClientRect()
  const x = (e.x - boardRect.x) / boardRect.width
  const y = (e.y - boardRect.top) / boardRect.height
  if (x < 0 || x > 1 || y < 0 || y > 1) return null
  let file: string
  let rank: number
  if (props.playerColor === 'b') {
    file = String.fromCharCode('h'.charCodeAt(0) - Math.floor(x * 8))
    rank = Math.floor(1 + y * 8)
  }
  else {
    file = String.fromCharCode('a'.charCodeAt(0) + Math.floor(x * 8))
    rank = Math.floor(9 - y * 8)
  }
  return (file + rank) as Square
}

function onMouseDown(e: MouseEvent) {
  const square = getSquareFromEvent(e)
  moving.value = square || null
}

function clearMoving() {
  moving.value = null
}

function onMouseUp(e: MouseEvent) {
  const from = moving.value
  const to = getSquareFromEvent(e)
  if (!from || !to || !isMovingOwnPiece()) return clearMoving()
  try {
    const c = new Chess()
    c.loadPgn(props.pgn)
    c.move({ from, to, promotion: 'q' })
  } catch (err) {
    return
  } finally {
    clearMoving()
  }
  props.onMove(from, to)
}

onMounted(() => {
  document.body.addEventListener('mousemove', onMouseMove)
  document.body.addEventListener('mouseup', clearMoving)
})

onUnmounted(() => {
  document.body.removeEventListener('mousemove', onMouseMove)
  document.body.removeEventListener('mouseup', clearMoving)
})

const possibleMoves = computed(() => {
  const m = moving.value
  if (!m || !isMovingOwnPiece()) return []
  return chess.value.moves({ square: m, verbose: true }).map((m) => m.to)
})

function getPieceStyle(s: Square) {
  if (moving.value !== s) return
  return `left: ${mousePosition.x}px; top: ${mousePosition.y}px;`
}

let piece: Piece

const SQUARES_INVERTED = [...SQUARES].reverse()

const squares = computed(() => props.playerColor === 'b' ? SQUARES_INVERTED : SQUARES)

type ChessBoardSlots = {
  overlay?: () => any
}

const slots = defineSlots<ChessBoardSlots>()
</script>

<template>
  <div class="board relative" ref="boardRef" draggable="false">
    <div v-for="s in squares" :class="`square ${chess.squareColor(s)} ${possibleMoves.includes(s) ? 'target' : ''}`"
      draggable="false" :set="(piece = chess.get(s))" :data-square="s" @mouseup="onMouseUp">
      <img :src="getPieceUrl(piece)" v-if="piece" :class="`piece ${moving === s ? 'dragging' : ''}`" draggable="false"
        @mousedown="onMouseDown" :data-square="s" :style="getPieceStyle(s)" />
    </div>
    <div v-if="slots.overlay"
      class="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-black/25 z-50">
      <slot name="overlay" />
    </div>
  </div>
</template>

<style scoped>
.board {
  --target-color: #00000022;
  --board-size: 75vh;
  --piece-size: calc(75vh / 8);
  height: var(--board-size);
  width: var(--board-size);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  user-select: none;
  border-radius: 8px;
  overflow: hidden;
}

.square {
  flex: 1;
  position: relative;
}

.square.target:before {
  --target-size: 28px;
  width: var(--target-size);
  height: var(--target-size);
  content: '';
  position: absolute;
  z-index: 2;
  pointer-events: none;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 100%;
  background-color: var(--target-color);
}

.square.target:has(.piece):before {
  background: none;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 6px var(--target-color) inset;
}

.dark {
  background-color: #b88762;
}

.light {
  background-color: #edd6b0;
}

.piece {
  display: block;
  width: var(--piece-size);
  height: var(--piece-size);
  cursor: grab;
  position: relative;
  z-index: 1;
}

.piece:active {
  cursor: grabbing;
  z-index: 1;
}

.piece.dragging {
  position: fixed;
  z-index: 3;
  transform: translateX(-50%) translateY(-50%);
}
</style>
