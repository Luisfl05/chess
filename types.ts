
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Color = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  row: number;
  col: number;
}

export interface Move {
  from: string;
  to: string;
  promotion?: PieceType;
}

export enum Difficulty {
  NOVICE = 'Novice',
  CASUAL = 'Casual',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface Puzzle {
  id: string;
  fen: string;
  solution: string[];
  description: string;
  difficulty: string;
}

export interface GameState {
  fen: string;
  history: string[];
  turn: Color;
  difficulty: Difficulty;
  playerColor: Color;
  isGameOver: boolean;
  winner: Color | 'draw' | null;
}
