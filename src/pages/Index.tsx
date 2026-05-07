import { useState } from 'react'
import { Crown, Undo2, ArrowDownUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

import { useChess } from '@/hooks/use-chess'
import { ChessBoard } from '@/components/chess/Board'
import { MoveHistory } from '@/components/chess/MoveHistory'
import { PlayerCard } from '@/components/chess/PlayerCard'
import { PromotionDialog, GameOverDialog } from '@/components/chess/Dialogs'

export default function Index() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeControl, setTimeControl] = useState('unlimited')
  const [theme, setTheme] = useState('charcoal')
  const [orientation, setOrientation] = useState<'w' | 'b'>('w')

  const {
    state,
    selectedIdx,
    legalMovesForSelected,
    promotionMove,
    gameStatus,
    scoreDiff,
    capW,
    capB,
    whiteTime,
    blackTime,
    setPromotionMove,
    handleSquareClick,
    handleDrop,
    executeMove,
    reset,
    undo,
  } = useChess(timeControl, isPlaying)

  const isCheck = gameStatus === 'check' || gameStatus === 'checkmate'

  if (!isPlaying) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-indigo-400">
              <Crown className="w-8 h-8" /> Xadrez Offline
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Configure sua partida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Tempo de Jogo</Label>
              <Select value={timeControl} onValueChange={setTimeControl}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="unlimited">Ilimitado</SelectItem>
                  <SelectItem value="5">Blitz (5 min)</SelectItem>
                  <SelectItem value="15">Rápida (15 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Tema do Tabuleiro</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem value="charcoal">Moderno (Verde)</SelectItem>
                  <SelectItem value="wood">Clássico (Madeira)</SelectItem>
                  <SelectItem value="blue">Oceano (Azul)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg"
              onClick={() => {
                reset()
                setIsPlaying(true)
              }}
            >
              Iniciar Partida
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] p-4 lg:p-6 gap-6 lg:gap-8 max-w-[1400px] mx-auto w-full">
      <div className="flex-1 flex flex-col justify-center items-center gap-4 lg:gap-6 w-full">
        <PlayerCard
          name="Pretas"
          color="b"
          captured={capW}
          score={scoreDiff < 0 ? -scoreDiff : 0}
          isTurn={state.turn === 'b'}
          time={blackTime}
        />

        <div className="w-full max-w-[700px] aspect-square">
          <ChessBoard
            state={state}
            theme={theme}
            orientation={orientation}
            selectedIdx={selectedIdx}
            legalMoves={legalMovesForSelected}
            isCheck={isCheck}
            onSquareClick={handleSquareClick}
            onSquareDrop={handleDrop}
          />
        </div>

        <PlayerCard
          name="Brancas"
          color="w"
          captured={capB}
          score={scoreDiff > 0 ? scoreDiff : 0}
          isTurn={state.turn === 'w'}
          time={whiteTime}
        />
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4 flex gap-3">
          <Button
            variant="secondary"
            onClick={undo}
            disabled={state.history.length === 0}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            <Undo2 className="w-4 h-4 mr-2" /> Desfazer
          </Button>
          <Button
            variant="secondary"
            onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            <ArrowDownUp className="w-4 h-4 mr-2" /> Inverter
          </Button>
        </Card>

        <MoveHistory history={state.history} />

        <Button
          variant="outline"
          className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300"
          onClick={() => setIsPlaying(false)}
        >
          Abandonar Partida
        </Button>
      </div>

      <PromotionDialog
        open={!!promotionMove}
        color={state.turn}
        onPromote={(pt) => promotionMove && executeMove({ ...promotionMove, promotion: pt })}
      />

      <GameOverDialog
        status={gameStatus}
        winner={state.turn === 'w' ? 'b' : 'w'}
        onReset={() => setIsPlaying(false)}
      />
    </div>
  )
}
