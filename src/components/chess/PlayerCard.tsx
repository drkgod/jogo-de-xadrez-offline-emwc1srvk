import { cn } from '@/lib/utils'
import { PieceType, Color } from '@/lib/chess/types'
import { PieceIcon } from './PieceIcon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface PlayerCardProps {
  name: string
  color: Color
  captured: PieceType[]
  score: number
  isTurn: boolean
  time: number | null
}

function formatTime(secs: number | null) {
  if (secs === null) return null
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerCard({ name, color, captured, score, isTurn, time }: PlayerCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[700px] flex items-center justify-between p-3 rounded-lg bg-slate-800/80 border-2 transition-colors duration-300',
        isTurn ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-700/50',
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 border-2 border-slate-600 bg-slate-700">
          <AvatarFallback className="bg-slate-700 text-slate-300 font-bold">
            {name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{name}</span>
            {isTurn && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                Pensando
              </span>
            )}
          </div>
          <div className="flex gap-0.5 items-center h-5">
            {captured.map((p, i) => (
              <div key={i} className="w-4 h-4 sm:w-5 sm:h-5">
                <PieceIcon piece={{ type: p, color: color === 'w' ? 'b' : 'w' }} />
              </div>
            ))}
            {score > 0 && <span className="text-xs text-slate-400 ml-2 font-medium">+{score}</span>}
          </div>
        </div>
      </div>

      {time !== null && (
        <div
          className={cn(
            'text-xl font-mono px-4 py-1.5 rounded-md border-2 tabular-nums font-bold tracking-wider',
            isTurn
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-slate-700 bg-slate-800 text-slate-400',
            time < 30 && isTurn && 'text-red-400 border-red-500 bg-red-500/10 animate-pulse',
          )}
        >
          {formatTime(time)}
        </div>
      )}
    </div>
  )
}
