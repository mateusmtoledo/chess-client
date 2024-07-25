const _pieces = Object.values(
  import.meta.glob('@/assets/pieces/unknown/*.svg', {
    eager: true,
    query: '?url',
    import: 'default'
  })
)

type PieceSet = {
  [key: string]: string
}

const pieces: PieceSet = {}
_pieces.forEach((piece) => {
  if (typeof piece !== 'string') return
  const filename = piece.match(/\/([^/]+)\.svg$/)?.[1].split('-')[0]
  if (!filename) return
  pieces[filename] = piece
})

export default pieces
