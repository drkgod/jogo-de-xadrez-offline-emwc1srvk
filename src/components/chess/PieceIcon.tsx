import { cn } from '@/lib/utils'
import { Piece } from '@/lib/chess/types'

const chars = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }

export function PieceIcon({ piece, className }: { piece: Piece; className?: string }) {
  const isWhite = piece.color === 'w'

  return (
    <svg viewBox="0 0 100 100" className={cn('w-full h-full drop-shadow-xl', className)}>
      <text
        x="50"
        y="55"
        fontSize="85"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isWhite ? '#ffffff' : '#222222'}
        stroke={isWhite ? '#222222' : '#ffffff'}
        strokeWidth="3"
        fontWeight="bold"
      >
        {chars[piece.type]}
      </text>
    </svg>
  )
}
