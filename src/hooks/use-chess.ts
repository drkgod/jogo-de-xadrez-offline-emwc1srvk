import { useState, useCallback, useMemo, useEffect } from 'react'
import { GameState, Move } from '@/lib/chess/types'
import { parseFen, INITIAL_FEN, getOpponent, getBoardMaterialDiff } from '@/lib/chess/utils'
import { getLegalMoves, getAllLegalMoves } from '@/lib/chess/legal'
import { applyMove } from '@/lib/chess/engine'
import { isAttacked } from '@/lib/chess/attacks'
import { useToast } from '@/hooks/use-toast'

export function useChess(timeControl: string, isPlaying: boolean = false) {
  const [state, setState] = useState<GameState>(() => parseFen(INITIAL_FEN))
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [promotionMove, setPromotionMove] = useState<Move | null>(null)

  const [whiteTime, setWhiteTime] = useState<number | null>(
    timeControl === 'unlimited' ? null : parseInt(timeControl) * 60,
  )
  const [blackTime, setBlackTime] = useState<number | null>(
    timeControl === 'unlimited' ? null : parseInt(timeControl) * 60,
  )

  const { toast } = useToast()

  const executeMove = useCallback((move: Move) => {
    setState((prev) => applyMove(prev, move))
    setSelectedIdx(null)
    setPromotionMove(null)
  }, [])

  const handleSquareClick = useCallback(
    (idx: number) => {
      if (promotionMove) return

      if (selectedIdx === null) {
        if (state.board[idx]?.color === state.turn) setSelectedIdx(idx)
      } else {
        const moves = getLegalMoves(state, selectedIdx)
        const moveTo = moves.filter((m) => m.to === idx)
        if (moveTo.length > 0) {
          if (moveTo[0].promotion) setPromotionMove(moveTo[0])
          else executeMove(moveTo[0])
        } else if (state.board[idx]?.color === state.turn) {
          setSelectedIdx(idx)
        } else {
          setSelectedIdx(null)
        }
      }
    },
    [selectedIdx, state, promotionMove, executeMove],
  )

  const handleDrop = useCallback(
    (fromIdx: number, toIdx: number) => {
      if (promotionMove) return
      const moves = getLegalMoves(state, fromIdx)
      const moveTo = moves.filter((m) => m.to === toIdx)
      if (moveTo.length > 0) {
        if (moveTo[0].promotion) setPromotionMove(moveTo[0])
        else executeMove(moveTo[0])
      }
      setSelectedIdx(null)
    },
    [state, promotionMove, executeMove],
  )

  const reset = useCallback(() => {
    setState(parseFen(INITIAL_FEN))
    setSelectedIdx(null)
    setPromotionMove(null)
    setWhiteTime(timeControl === 'unlimited' ? null : parseInt(timeControl) * 60)
    setBlackTime(timeControl === 'unlimited' ? null : parseInt(timeControl) * 60)
  }, [timeControl])

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev
      return prev.history[prev.history.length - 1].stateBefore
    })
    setSelectedIdx(null)
    setPromotionMove(null)
  }, [])

  const legalMovesForSelected = useMemo(() => {
    if (selectedIdx === null) return []
    return getLegalMoves(state, selectedIdx)
  }, [selectedIdx, state])

  const gameStatus = useMemo(() => {
    if (whiteTime === 0) return 'timeout_w'
    if (blackTime === 0) return 'timeout_b'

    const kingIdx = state.board.findIndex((p) => p?.type === 'k' && p?.color === state.turn)
    const inCheck = kingIdx !== -1 && isAttacked(state.board, kingIdx, getOpponent(state.turn))
    const hasMoves = getAllLegalMoves(state).length > 0

    if (!hasMoves) return inCheck ? 'checkmate' : 'stalemate'
    return inCheck ? 'check' : 'playing'
  }, [state, whiteTime, blackTime])

  useEffect(() => {
    if (gameStatus === 'check') {
      toast({
        title: 'Xeque!',
        description: `O Rei das ${state.turn === 'w' ? 'Brancas' : 'Pretas'} está em perigo.`,
        duration: 3000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, state.turn])

  useEffect(() => {
    if (!isPlaying) return
    if (gameStatus !== 'playing' && gameStatus !== 'check') return
    if (timeControl === 'unlimited') return

    const interval = setInterval(() => {
      if (state.turn === 'w') setWhiteTime((t) => (t ? t - 1 : 0))
      else setBlackTime((t) => (t ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStatus, state.turn, timeControl, isPlaying])

  const scoreDiff = useMemo(() => getBoardMaterialDiff(state.board), [state.board])
  const val = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 }
  const sortFn = (a: any, b: any) => val[b as keyof typeof val] - val[a as keyof typeof val]
  const capW = [...state.capturedWhite].sort(sortFn)
  const capB = [...state.capturedBlack].sort(sortFn)

  return {
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
  }
}
