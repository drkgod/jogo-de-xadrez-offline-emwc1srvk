import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PieceIcon } from './PieceIcon'
import { PieceType, Color } from '@/lib/chess/types'

interface PromotionDialogProps {
  open: boolean
  color: Color
  onPromote: (pt: PieceType) => void
}

export function PromotionDialog({ open, color, onPromote }: PromotionDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm border-slate-700 bg-slate-800 text-slate-100 hide-close-button [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Promover Peão</DialogTitle>
          <DialogDescription className="text-slate-400">
            Escolha a peça para promoção.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-around py-6">
          {['q', 'r', 'b', 'n'].map((pt) => (
            <button
              key={pt}
              onClick={() => onPromote(pt as PieceType)}
              className="w-16 h-16 hover:bg-slate-700 rounded-md p-2 transition-colors"
            >
              <PieceIcon piece={{ type: pt as PieceType, color }} />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface GameOverDialogProps {
  status: string | null
  winner: Color
  onReset: () => void
}

export function GameOverDialog({ status, winner, onReset }: GameOverDialogProps) {
  const isOpen =
    status === 'checkmate' ||
    status === 'stalemate' ||
    status === 'timeout_w' ||
    status === 'timeout_b'

  let title = 'Fim de Jogo'
  let description = ''

  if (status === 'checkmate') {
    title = 'Xeque-mate!'
    description = `As ${winner === 'w' ? 'Brancas' : 'Pretas'} venceram.`
  } else if (status === 'stalemate') {
    title = 'Empate'
    description = 'Empate por afogamento (Stalemate).'
  } else if (status === 'timeout_w') {
    title = 'Tempo Esgotado'
    description = 'O tempo das Brancas acabou. As Pretas venceram.'
  } else if (status === 'timeout_b') {
    title = 'Tempo Esgotado'
    description = 'O tempo das Pretas acabou. As Brancas venceram.'
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm border-slate-700 bg-slate-800 text-slate-100 hide-close-button [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-slate-300 text-base">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onReset} className="w-full bg-indigo-600 hover:bg-indigo-700">
            Jogar Novamente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
