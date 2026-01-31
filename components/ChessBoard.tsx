
import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { PIECE_IMAGES } from '../constants.tsx';
import { Color } from '../types';

interface ChessBoardProps {
  fen: string;
  onDrop: (source: string, target: string, promotion?: string) => boolean;
  playerColor: Color;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, onDrop, playerColor }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const chess = new Chess(fen);
  
  useEffect(() => {
    setSelectedSquare(null);
  }, [fen]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = playerColor === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
  const displayFiles = playerColor === 'w' ? files : [...files].reverse();

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }
      
      const success = onDrop(selectedSquare, square);
      if (success) {
        setSelectedSquare(null);
      } else {
        const piece = chess.get(square as Square);
        if (piece && piece.color === playerColor && piece.color === chess.turn()) {
          setSelectedSquare(square);
        } else {
          setSelectedSquare(null);
        }
      }
    } else {
      const piece = chess.get(square as Square);
      if (piece && piece.color === playerColor && piece.color === chess.turn()) {
        setSelectedSquare(square);
      }
    }
  };

  return (
    <div className="relative aspect-square w-full max-w-[600px] border-[14px] border-[#2d1a12] shadow-[0_40px_80px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden select-none">
      <div className="grid grid-cols-8 grid-rows-8 h-full bg-[#2d1a12]">
        {ranks.map((rank, r) => (
          displayFiles.map((file, c) => {
            const squareName = `${file}${rank}`;
            const piece = chess.get(squareName as Square);
            const isLight = (r + c) % 2 === 0;
            const isSelected = selectedSquare === squareName;
            
            return (
              <div
                key={squareName}
                onClick={() => handleSquareClick(squareName)}
                className={`relative flex items-center justify-center cursor-pointer transition-all duration-100
                  ${isLight ? 'bg-[#d2b48c]' : 'bg-[#8b4513]'}
                  ${isSelected ? 'bg-[#f4d03f]/80 ring-inset ring-4 ring-[#f1c40f]' : ''}
                  hover:brightness-110 active:brightness-90
                `}
              >
                {/* Coordenadas */}
                {c === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[9px] font-black uppercase ${isLight ? 'text-[#8b4513]/50' : 'text-[#d2b48c]/50'}`}>
                    {rank}
                  </span>
                )}
                {r === 7 && (
                  <span className={`absolute bottom-0.5 right-1 text-[9px] font-black uppercase ${isLight ? 'text-[#8b4513]/50' : 'text-[#d2b48c]/50'}`}>
                    {file}
                  </span>
                )}

                {/* Piezas */}
                {piece && (
                  <img
                    src={PIECE_IMAGES[`${piece.color}-${piece.type}`]}
                    alt={`${piece.color} ${piece.type}`}
                    className={`w-[92%] h-[92%] z-10 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform transition-all duration-200 ${isSelected ? 'scale-110 -translate-y-1' : 'scale-100'}`}
                    draggable={false}
                    loading="eager"
                  />
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
