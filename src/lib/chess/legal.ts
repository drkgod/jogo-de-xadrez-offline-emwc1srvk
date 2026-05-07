import { GameState, Move } from './types'
import { getPseudoMoves } from './moves'
import { isAttacked } from './attacks'
import { simulateMove } from './engine'
import { getOpponent } from './utils'

export function getLegalMoves(state: GameState, from: number): Move[] {
  const p = state.board[from]
  if (!p || p.color !== state.turn) return []

  const moves = getPseudoMoves(state, from)
  const legal = moves.filter((m) => {
    const nextState = simulateMove(state, m)
    const kingIdx = nextState.board.findIndex((sq) => sq?.type === 'k' && sq?.color === state.turn)
    if (kingIdx === -1) return false
    return !isAttacked(nextState.board, kingIdx, getOpponent(state.turn))
  })

  if (p.type === 'k') {
    const isCheck = isAttacked(state.board, from, getOpponent(state.turn))
    if (!isCheck) {
      if (state.turn === 'w') {
        if (
          state.castling.wK &&
          !state.board[61] &&
          !state.board[62] &&
          !isAttacked(state.board, 61, 'b') &&
          !isAttacked(state.board, 62, 'b')
        ) {
          legal.push({ from, to: 62, castling: 'k' })
        }
        if (
          state.castling.wQ &&
          !state.board[59] &&
          !state.board[58] &&
          !state.board[57] &&
          !isAttacked(state.board, 59, 'b') &&
          !isAttacked(state.board, 58, 'b')
        ) {
          legal.push({ from, to: 58, castling: 'q' })
        }
      } else {
        if (
          state.castling.bK &&
          !state.board[5] &&
          !state.board[6] &&
          !isAttacked(state.board, 5, 'w') &&
          !isAttacked(state.board, 6, 'w')
        ) {
          legal.push({ from, to: 6, castling: 'k' })
        }
        if (
          state.castling.bQ &&
          !state.board[3] &&
          !state.board[2] &&
          !state.board[1] &&
          !isAttacked(state.board, 3, 'w') &&
          !isAttacked(state.board, 2, 'w')
        ) {
          legal.push({ from, to: 2, castling: 'q' })
        }
      }
    }
  }

  return legal
}

export function getAllLegalMoves(state: GameState): Move[] {
  const all: Move[] = []
  for (let i = 0; i < 64; i++) {
    if (state.board[i]?.color === state.turn) {
      all.push(...getLegalMoves(state, i))
    }
  }
  return all
}
