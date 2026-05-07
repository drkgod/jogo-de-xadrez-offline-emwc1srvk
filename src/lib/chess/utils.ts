import { GameState, Color, Board, PieceType } from './types'

export function idxToPos(idx: number) {
  return { r: Math.floor(idx / 8), c: idx % 8 }
}

export function posToIdx(r: number, c: number) {
  return r * 8 + c
}

export function inBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

export function algebraic(idx: number) {
  const { r, c } = idxToPos(idx)
  return `${String.fromCharCode(97 + c)}${8 - r}`
}

export function getOpponent(c: Color): Color {
  return c === 'w' ? 'b' : 'w'
}

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function parseFen(fen: string): GameState {
  const [boardStr, turnStr, castlingStr, epStr, halfMovesStr, fullMovesStr] = fen.split(' ')
  const board: Board = new Array(64).fill(null)

  let r = 0,
    c = 0
  for (const char of boardStr) {
    if (char === '/') {
      r++
      c = 0
    } else if (/\d/.test(char)) {
      c += parseInt(char, 10)
    } else {
      const color = char === char.toUpperCase() ? 'w' : 'b'
      board[r * 8 + c] = { type: char.toLowerCase() as PieceType, color }
      c++
    }
  }

  const castling = {
    wK: castlingStr.includes('K'),
    wQ: castlingStr.includes('Q'),
    bK: castlingStr.includes('k'),
    bQ: castlingStr.includes('q'),
  }

  let epSquare = null
  if (epStr !== '-') {
    const epCol = epStr.charCodeAt(0) - 97
    const epRow = 8 - parseInt(epStr[1], 10)
    epSquare = epRow * 8 + epCol
  }

  return {
    board,
    turn: turnStr as Color,
    castling,
    epSquare,
    halfMoves: parseInt(halfMovesStr, 10) || 0,
    fullMoves: parseInt(fullMovesStr, 10) || 1,
    history: [],
    capturedWhite: [],
    capturedBlack: [],
  }
}

export function getBoardMaterialDiff(board: Board) {
  const val = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 }
  let w = 0,
    b = 0
  board.forEach((p) => {
    if (p) {
      if (p.color === 'w') w += val[p.type]
      else b += val[p.type]
    }
  })
  return w - b
}
