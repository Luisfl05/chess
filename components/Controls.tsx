
import React from 'react';
import { Difficulty, Color } from '../types';
import { RotateCcw, Zap, SlidersHorizontal } from 'lucide-react';

interface ControlsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  playerColor: Color;
  setPlayerColor: (c: Color) => void;
  onReset: () => void;
  onAnalyze: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  difficulty, 
  setDifficulty, 
  playerColor, 
  setPlayerColor,
  onReset,
  onAnalyze
}) => {
  const difficultyMap: Record<Difficulty, string> = {
    [Difficulty.NOVICE]: 'Novato',
    [Difficulty.CASUAL]: 'Aficionado',
    [Difficulty.INTERMEDIATE]: 'Intermedio',
    [Difficulty.ADVANCED]: 'Avanzado',
    [Difficulty.EXPERT]: 'Experto'
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          <SlidersHorizontal size={14} /> Nivel de Dificultad
        </label>
        <div className="grid grid-cols-1 gap-1">
          {Object.values(Difficulty).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-left px-3 py-2 rounded-md text-sm transition-all ${
                difficulty === d 
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50 font-semibold' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {difficultyMap[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase">Jugar con</label>
        <div className="flex gap-2">
          <button
            onClick={() => setPlayerColor('w')}
            className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
              playerColor === 'w' 
              ? 'bg-white text-black border-white shadow-lg font-bold' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Blancas
          </button>
          <button
            onClick={() => setPlayerColor('b')}
            className={`flex-1 py-2 rounded-lg text-sm border transition-all ${
              playerColor === 'b' 
              ? 'bg-slate-700 text-white border-slate-600 shadow-lg font-bold' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Negras
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-4">
        <button 
          onClick={onAnalyze}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Zap size={18} /> Analizar con IA
        </button>
        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-all border border-slate-700 active:scale-95"
        >
          <RotateCcw size={18} /> Reiniciar
        </button>
      </div>
    </div>
  );
};

export default Controls;
