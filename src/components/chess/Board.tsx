import { cn } from '@/lib/utils'
import { GameState, Move } from '@/lib/chess/types'
import { Square } from './Square'
import { idxToPos } from '@/lib/chess/utils'

interface BoardProps {
  state: GameState
  theme: string
  orientation: 'w' | 'b'
  selectedIdx: number | null
  legalMoves: Move[]
  isCheck: boolean
  onSquareClick: (idx: number) => void
  onSquareDrop: (from: number, to: number) => void
}

export function ChessBoard({
  state,
  theme,
  orientation,
  selectedIdx,
  legalMoves,
  isCheck,
  onSquareClick,
  onSquareDrop,
}: BoardProps) {
  const boardIndices = Array.from({ length: 64 }, (_, i) => i)
  const displayIndices = orientation === 'w' ? boardIndices : [...boardIndices].reverse()

  const lastMove = state.history.length > 0 ? state.history[state.history.length - 1].move : null
  const kingIdx = state.board.findIndex((p) => p?.type === 'k' && p?.color === state.turn)

  return (
    <div
      className={cn(
        'grid grid-cols-8 grid-rows-8 w-full max-w-[700px] border-[6px] border-[var(--board-dark)] rounded overflow-hidden shadow-2xl transition-colors duration-300',
        `theme-${theme}`,
      )}
    >
      {displayIndices.map((idx) => {
        const { r, c } = idxToPos(idx)
        const isDark = (r + c) % 2 === 1
        const piece = state.board[idx]
        const isSelected = selectedIdx === idx
        const isLastMove = lastMove && (lastMove.from === idx || lastMove.to === idx)
        const isHint = legalMoves.some((m) => m.to === idx)
        const isCheckSquare = isCheck && idx === kingIdx

        const showRank = c === (orientation === 'w' ? 0 : 7)
        const showFile = r === (orientation === 'w' ? 7 : 0)

        return (
          <Square
            key={idx}
            idx={idx}
            piece={piece}
            isDark={isDark}
            isSelected={isSelected}
            isLastMove={!!isLastMove}
            isHint={isHint}
            isCheck={!!isCheckSquare}
            showRank={showRank}
            showFile={showFile}
            onClick={onSquareClick}
            onDrop={onSquareDrop}
          />
        )
      })}
    </div>
  )
}
