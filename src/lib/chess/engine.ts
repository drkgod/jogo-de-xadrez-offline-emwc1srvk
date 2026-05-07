import { GameState, Move } from './types'
import { getOpponent, idxToPos, posToIdx, algebraic } from './utils'

export function simulateMove(state: GameState, move: Move): GameState {
  const newBoard = [...state.board]
  const p = newBoard[move.from]!
  newBoard[move.from] = null
  newBoard[move.to] = move.promotion ? { type: move.promotion, color: p.color } : p

  if (move.ep) {
    const { r, c } = idxToPos(move.to)
    const capRow = p.color === 'w' ? r + 1 : r - 1
    newBoard[posToIdx(capRow, c)] = null
  }
  if (move.castling === 'k') {
    newBoard[move.to - 1] = newBoard[move.to + 1]
    newBoard[move.to + 1] = null
  }
  if (move.castling === 'q') {
    newBoard[move.to + 1] = newBoard[move.to - 2]
    newBoard[move.to - 2] = null
  }
  return { ...state, board: newBoard }
}

export function applyMove(state: GameState, move: Move): GameState {
  const p = state.board[move.from]!
  const nextState = simulateMove(state, move)

  nextState.turn = getOpponent(state.turn)
  nextState.castling = { ...state.castling }

  if (p.type === 'k') {
    if (p.color === 'w') {
      nextState.castling.wK = false
      nextState.castling.wQ = false
    } else {
      nextState.castling.bK = false
      nextState.castling.bQ = false
    }
  }
  if (p.type === 'r') {
    if (move.from === 63) nextState.castling.wK = false
    if (move.from === 56) nextState.castling.wQ = false
    if (move.from === 7) nextState.castling.bK = false
    if (move.from === 0) nextState.castling.bQ = false
  }
  if (move.to === 63) nextState.castling.wK = false
  if (move.to === 56) nextState.castling.wQ = false
  if (move.to === 7) nextState.castling.bK = false
  if (move.to === 0) nextState.castling.bQ = false

  if (p.type === 'p' && Math.abs(idxToPos(move.from).r - idxToPos(move.to).r) === 2) {
    nextState.epSquare = move.from + (p.color === 'w' ? -8 : 8)
  } else {
    nextState.epSquare = null
  }

  if (p.type === 'p' || move.captured) nextState.halfMoves = 0
  else nextState.halfMoves = state.halfMoves + 1

  if (state.turn === 'b') nextState.fullMoves = state.fullMoves + 1

  let san = ''
  if (move.castling === 'k') san = 'O-O'
  else if (move.castling === 'q') san = 'O-O-O'
  else {
    const pStr = p.type === 'p' ? '' : p.type.toUpperCase()
    const capStr = move.captured || move.ep ? 'x' : ''
    const toStr = algebraic(move.to)
    let fromStr = ''
    if (p.type === 'p' && (move.captured || move.ep)) fromStr = algebraic(move.from)[0]
    san = `${pStr}${fromStr}${capStr}${toStr}`
    if (move.promotion) san += `=${move.promotion.toUpperCase()}`
  }

  nextState.history = [...state.history, { move, piece: p, san, stateBefore: state }]
  nextState.capturedWhite = [...state.capturedWhite]
  nextState.capturedBlack = [...state.capturedBlack]

  if (move.captured || move.ep) {
    const cap = move.ep ? 'p' : move.captured!.type
    if (state.turn === 'w') nextState.capturedBlack.push(cap)
    else nextState.capturedWhite.push(cap)
  }

  return nextState
}
