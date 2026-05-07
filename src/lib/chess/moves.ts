import { GameState, Move, PieceType } from './types'
import { posToIdx, idxToPos, inBounds, getOpponent } from './utils'

const KNIGHT_OFFSETS = [
  [-2, -1],
  [-2, 1],
  [-1, -2],
  [-1, 2],
  [1, -2],
  [1, 2],
  [2, -1],
  [2, 1],
]
const KING_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]
const SLIDER_DIRS = {
  b: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  r: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  q: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
}

export function getPseudoMoves(state: GameState, from: number): Move[] {
  const p = state.board[from]
  if (!p) return []
  const moves: Move[] = []
  const { r, c } = idxToPos(from)

  const addIfValid = (nr: number, nc: number) => {
    if (!inBounds(nr, nc)) return false
    const to = posToIdx(nr, nc)
    const target = state.board[to]
    if (!target) {
      moves.push({ from, to })
      return true
    }
    if (target.color !== p.color) {
      moves.push({ from, to, captured: target })
    }
    return false
  }

  if (p.type === 'p') {
    const dir = p.color === 'w' ? -1 : 1
    const startR = p.color === 'w' ? 6 : 1
    const promR = p.color === 'w' ? 0 : 7

    const nr = r + dir
    if (inBounds(nr, c) && !state.board[posToIdx(nr, c)]) {
      const to = posToIdx(nr, c)
      if (nr === promR) {
        ;['q', 'r', 'b', 'n'].forEach((pt) => moves.push({ from, to, promotion: pt as PieceType }))
      } else {
        moves.push({ from, to })
        if (r === startR && !state.board[posToIdx(r + dir * 2, c)]) {
          moves.push({ from, to: posToIdx(r + dir * 2, c) })
        }
      }
    }

    for (const dc of [-1, 1]) {
      if (inBounds(nr, c + dc)) {
        const to = posToIdx(nr, c + dc)
        const target = state.board[to]
        if (target && target.color !== p.color) {
          if (nr === promR) {
            ;['q', 'r', 'b', 'n'].forEach((pt) =>
              moves.push({ from, to, captured: target, promotion: pt as PieceType }),
            )
          } else {
            moves.push({ from, to, captured: target })
          }
        } else if (state.epSquare === to) {
          moves.push({ from, to, ep: true, captured: { type: 'p', color: getOpponent(p.color) } })
        }
      }
    }
  } else if (p.type === 'n') {
    KNIGHT_OFFSETS.forEach(([dr, dc]) => addIfValid(r + dr, c + dc))
  } else if (p.type === 'k') {
    KING_OFFSETS.forEach(([dr, dc]) => addIfValid(r + dr, c + dc))
  } else {
    SLIDER_DIRS[p.type as 'r' | 'b' | 'q'].forEach(([dr, dc]) => {
      let nr = r + dr,
        nc = c + dc
      while (addIfValid(nr, nc)) {
        nr += dr
        nc += dc
      }
    })
  }
  return moves
}
