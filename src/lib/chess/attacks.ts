import { Board, Color } from './types'
import { idxToPos, posToIdx, inBounds } from './utils'

export function isAttacked(board: Board, idx: number, color: Color): boolean {
  const { r, c } = idxToPos(idx)

  // Pawns
  const pDir = color === 'w' ? 1 : -1
  for (const dc of [-1, 1]) {
    if (inBounds(r + pDir, c + dc)) {
      const p = board[posToIdx(r + pDir, c + dc)]
      if (p && p.color === color && p.type === 'p') return true
    }
  }

  // Knights
  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]
  for (const [dr, dc] of knightMoves) {
    if (inBounds(r + dr, c + dc)) {
      const p = board[posToIdx(r + dr, c + dc)]
      if (p && p.color === color && p.type === 'n') return true
    }
  }

  // Kings
  const kingMoves = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]
  for (const [dr, dc] of kingMoves) {
    if (inBounds(r + dr, c + dc)) {
      const p = board[posToIdx(r + dr, c + dc)]
      if (p && p.color === color && p.type === 'k') return true
    }
  }

  // Sliders
  const lines = [
    { dr: -1, dc: 0, types: ['r', 'q'] },
    { dr: 1, dc: 0, types: ['r', 'q'] },
    { dr: 0, dc: -1, types: ['r', 'q'] },
    { dr: 0, dc: 1, types: ['r', 'q'] },
    { dr: -1, dc: -1, types: ['b', 'q'] },
    { dr: -1, dc: 1, types: ['b', 'q'] },
    { dr: 1, dc: -1, types: ['b', 'q'] },
    { dr: 1, dc: 1, types: ['b', 'q'] },
  ]

  for (const line of lines) {
    let nr = r + line.dr,
      nc = c + line.dc
    while (inBounds(nr, nc)) {
      const p = board[posToIdx(nr, nc)]
      if (p) {
        if (p.color === color && line.types.includes(p.type)) return true
        break
      }
      nr += line.dr
      nc += line.dc
    }
  }

  return false
}
