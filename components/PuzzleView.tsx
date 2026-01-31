
import React, { useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';
import { PUZZLES } from '../constants.tsx';
import { CheckCircle2, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

const PuzzleView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [puzzleGame, setPuzzleGame] = useState(new Chess(PUZZLES[currentIdx].fen));
  const [status, setStatus] = useState<'solving' | 'correct' | 'wrong'>('solving');

  const onPuzzleDrop = (from: string, to: string) => {
    if (status === 'correct') return false;

    const gameCopy = new Chess(puzzleGame.fen());
    const move = gameCopy.move({ from, to, promotion: 'q' });

    if (!move) return false;

    const currentSolution = PUZZLES[currentIdx].solution[0];
    if (move.san === currentSolution || move.from + move.to === currentSolution) {
      setPuzzleGame(gameCopy);
      setStatus('correct');
      return true;
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('solving'), 1200);
      return false;
    }
  };

  const nextPuzzle = () => {
    const next = (currentIdx + 1) % PUZZLES.length;
    setCurrentIdx(next);
    setPuzzleGame(new Chess(PUZZLES[next].fen));
    setStatus('solving');
  };

  const prevPuzzle = () => {
    const prev = (currentIdx - 1 + PUZZLES.length) % PUZZLES.length;
    setCurrentIdx(prev);
    setPuzzleGame(new Chess(PUZZLES[prev].fen));
    setStatus('solving');
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full max-w-[600px] flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
        <button onClick={prevPuzzle} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <ChevronLeft size={28} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white uppercase tracking-tighter">Problema {currentIdx + 1}</h2>
          <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full uppercase">{PUZZLES[currentIdx].difficulty}</span>
        </div>
        <button onClick={nextPuzzle} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <ChevronRight size={28} />
        </button>
      </div>

      <ChessBoard 
        fen={puzzleGame.fen()} 
        onDrop={onPuzzleDrop} 
        playerColor="w" 
      />

      <div className="w-full max-w-[600px] bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-slate-800">
           <Lightbulb size={40} />
        </div>
        
        <p className="text-slate-200 text-lg text-center mb-6 font-medium italic relative z-10">
          "{PUZZLES[currentIdx].description}"
        </p>

        {status === 'correct' ? (
          <div className="flex items-center justify-center gap-3 text-green-400 font-bold bg-green-400/10 py-4 rounded-xl border border-green-400/20 animate-bounce">
            <CheckCircle2 size={24} /> ¡Movimiento Correcto! Excelente visión.
          </div>
        ) : status === 'wrong' ? (
          <div className="text-center text-red-400 font-bold bg-red-400/10 py-4 rounded-xl border border-red-400/20">
            Inténtalo de nuevo. No es el mejor movimiento.
          </div>
        ) : (
          <div className="text-center text-slate-500 py-4 border border-dashed border-slate-700 rounded-xl font-semibold uppercase tracking-widest text-sm">
            Mueve una pieza para resolver...
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleView;
