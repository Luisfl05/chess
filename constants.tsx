
import React from 'react';

export const PIECE_IMAGES: Record<string, string> = {
  'w-p': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  'w-r': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  'w-n': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  'w-b': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  'w-q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  'w-k': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  'b-p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  'b-r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  'b-n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  'b-b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  'b-q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  'b-k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const PUZZLES = [
  {
    id: '1',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: ['Qxf7#'],
    description: "Mate del Pastor: Encuentra el mate en una jugada.",
    difficulty: 'Aficionado'
  },
  {
    id: '2',
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    solution: ['exd5'],
    description: "Control Central: Captura el peón central.",
    difficulty: 'Aficionado'
  },
  {
    id: '3',
    fen: 'r2qkb1r/pp2pppp/2n2n2/1B1p4/3P2b1/2N2N2/PPP2PPP/R1BQK2R w KQkq - 4 7',
    solution: ['Bxc6+'],
    description: "Debilidad Estructural: Daña la estructura de peones negra.",
    difficulty: 'Aficionado'
  },
  {
    id: '4',
    fen: 'r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1 w - - 0 1',
    solution: ['Qf6+'],
    description: "Ataque Decisivo: Encuentra el jaque que destruye la defensa.",
    difficulty: 'Intermedio'
  },
  {
    id: '5',
    fen: 'r2q1rk1/ppp2ppp/2n1bn2/2bpp3/4P3/2PP1NPP/PP3PB1/RNBQR1K1 b - - 0 9',
    solution: ['dxe4'],
    description: "Tensión en el Centro: Decide el intercambio correcto.",
    difficulty: 'Intermedio'
  },
  {
    id: '6',
    fen: 'rn1qk2r/pbpp1ppp/1p2pn2/8/1bPP4/2N2NP1/PP2PPBP/R1BQK2R b KQkq - 2 6',
    solution: ['Bxc3+'],
    description: "Doblando peones: Elimina el caballo centralizado.",
    difficulty: 'Intermedio'
  },
  {
    id: '7',
    fen: 'r1b2rk1/pp3ppp/2n1pn2/q2p4/2PP4/P1PB1N2/3B1PPP/R2QK2R w KQ - 3 11',
    solution: ['cxd5'],
    description: "Apertura de Líneas: Simplifica la posición a tu favor.",
    difficulty: 'Avanzado'
  },
  {
    id: '8',
    fen: '3r2k1/p4p1p/1p4p1/2r5/4R3/P1P5/1P3PPP/4R1K1 w - - 0 1',
    solution: ['Re8+'],
    description: "Dominio de la Séptima: Inicia la invasión por la columna abierta.",
    difficulty: 'Avanzado'
  },
  {
    id: '9',
    fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 4 10',
    solution: ['Nd5'],
    description: "Ataque al centro: Presiona la dama y el caballo clavado.",
    difficulty: 'Avanzado'
  },
  {
    id: '10',
    fen: '2r3k1/1p3p1p/p5p1/5b2/3Q4/1P6/P4PPP/2R3K1 b - - 0 1',
    solution: ['Rxc1+'],
    description: "Mate de Pasillo: Aprovecha la debilidad de la primera fila.",
    difficulty: 'Experto'
  },
  {
    id: '11',
    fen: 'r2qk2r/pb1nbppp/1pn1p3/2ppP3/3P4/2PB1NN1/PP3PPP/R1BQK2R w KQkq - 1 10',
    solution: ['O-O'],
    description: "Consolidación: Completa tu desarrollo bajo presión.",
    difficulty: 'Experto'
  },
  {
    id: '12',
    fen: '2r2rk1/1b1n1ppp/pp1qpn2/3p4/2PP4/1PNB1N2/P1Q2PPP/R3R1K1 w - - 2 15',
    solution: ['c5'],
    description: "Cerrando el flanco: Gana espacio y restringe las piezas negras.",
    difficulty: 'Experto'
  }
];
