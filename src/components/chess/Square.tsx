import { cn } from '@/lib/utils'
import { PieceIcon } from './PieceIcon'
import { Piece } from '@/lib/chess/types'

interface SquareProps {
  idx: number
  piece: Piece | null
  isDark: boolean
  isSelected: boolean
  isLastMove: boolean
  isHint: boolean
  isCheck: boolean
  showRank: boolean
  showFile: boolean
  onClick: (idx: number) => void
  onDrop: (from: number, to: number) => void
}

export function Square({
  idx,
  piece,
  isDark,
  isSelected,
  isLastMove,
  isHint,
  isCheck,
  showRank,
  showFile,
  onClick,
  onDrop,
}: SquareProps) {
  const file = String.fromCharCode(97 + (idx % 8))
  const rank = 8 - Math.floor(idx / 8)

  return (
    <div
      className={cn(
        'relative flex items-center justify-center aspect-square select-none cursor-pointer',
        isDark
          ? 'bg-[var(--board-dark)] text-[var(--board-light)]'
          : 'bg-[var(--board-light)] text-[var(--board-dark)]',
        isSelected && 'after:absolute after:inset-0 after:bg-yellow-400/50',
        isLastMove && 'after:absolute after:inset-0 after:bg-yellow-300/40',
        isCheck && 'pulse-check',
      )}
      onClick={() => onClick(idx)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'))
        if (!isNaN(fromIdx)) onDrop(fromIdx, idx)
      }}
    >
      {showRank && (
        <span className="absolute top-1 left-1 text-[10px] sm:text-xs font-semibold opacity-80 pointer-events-none">
          {rank}
        </span>
      )}
      {showFile && (
        <span className="absolute bottom-0 right-1 text-[10px] sm:text-xs font-semibold opacity-80 pointer-events-none">
          {file}
        </span>
      )}

      {piece && (
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', idx.toString())
          }}
          className="w-[85%] h-[85%] relative z-10 hover:scale-105 transition-transform"
        >
          <PieceIcon piece={piece} />
        </div>
      )}

      {isHint && (
        <div
          className={cn(
            'absolute rounded-full z-20 pointer-events-none',
            piece ? 'w-[85%] h-[85%] border-[6px] border-black/20' : 'w-[25%] h-[25%] bg-black/20',
          )}
        />
      )}
    </div>
  )
}
