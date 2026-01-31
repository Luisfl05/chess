
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import ChessBoard from './components/ChessBoard';
import Controls from './components/Controls';
import PuzzleView from './components/PuzzleView';
import { Difficulty, Color } from './types';
import { getBestMove, analyzePosition } from './services/geminiChess';
import { Trophy, Brain, Target, Info, Menu, X, Crown, History, ListOrdered } from 'lucide-react';

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [view, setView] = useState<'play' | 'puzzles'>('play');
  const [analysis, setAnalysis] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string, to: string } | null>(null);
  
  const historyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [game.history().length]);

  const makeAiMove = useCallback(async (currentFen: string, history: string[]) => {
    if (new Chess(currentFen).isGameOver()) return;
    
    setIsAiThinking(true);
    const start = Date.now();
    
    // Llamada a la IA
    const aiMoveSan = await getBestMove(currentFen, history, difficulty);
    
    // Garantizar que la IA no responda demasiado rápido (mínimo 600ms para efecto visual)
    // Pero máximo 2s total.
    const elapsed = Date.now() - start;
    const minDelay = 600;
    const wait = Math.max(0, minDelay - elapsed);

    setTimeout(() => {
      setGame((prevGame) => {
        const gameCopy = new Chess(prevGame.fen());
        let moveApplied = false;

        if (aiMoveSan) {
          try {
            const moveResult = gameCopy.move(aiMoveSan);
            if (moveResult) moveApplied = true;
          } catch (e) {
            console.warn("IA Movimiento inválido sugerido:", aiMoveSan);
          }
        }

        // Respaldo si la IA falla (cuota agotada o error) o sugiere movimiento ilegal
        if (!moveApplied) {
          const moves = gameCopy.moves();
          if (moves.length > 0) {
            gameCopy.move(moves[Math.floor(Math.random() * moves.length)]);
          }
        }
        
        setIsAiThinking(false);
        return gameCopy;
      });
    }, wait);
  }, [difficulty]);

  useEffect(() => {
    // Si es turno de la IA, disparamos el cálculo
    if (game.turn() !== playerColor && !game.isGameOver() && view === 'play' && !isAiThinking) {
      const timer = setTimeout(() => {
        makeAiMove(game.fen(), game.history());
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [game.fen(), playerColor, makeAiMove, view, isAiThinking]);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (game.turn() !== playerColor || isAiThinking || game.isGameOver()) return false;

    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(sourceSquare as any);
    
    const isPromotion = 
      piece?.type === 'p' && 
      ((piece.color === 'w' && targetSquare[1] === '8') || 
       (piece.color === 'b' && targetSquare[1] === '1'));

    if (isPromotion) {
      const moves = gameCopy.moves({ square: sourceSquare as any, verbose: true });
      const isValid = moves.some(m => m.to === targetSquare);
      if (isValid) {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return true;
      }
      return false;
    }

    try {
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
      if (move === null) return false;
      
      // Actualizamos el estado inmediatamente para registrar la jugada
      setGame(gameCopy);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handlePromotionSelection = (pieceType: string) => {
    if (!pendingPromotion) return;
    const gameCopy = new Chess(game.fen());
    gameCopy.move({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: pieceType,
    });
    setGame(gameCopy);
    setPendingPromotion(null);
  };

  const resetGame = () => {
    setGame(new Chess());
    setAnalysis('');
    setPendingPromotion(null);
    setIsAiThinking(false);
  };

  const runAnalysis = async () => {
    const result = await analyzePosition(game.fen());
    setAnalysis(result);
  };

  // El historial se reconstruye a partir del objeto game para garantizar integridad total
  const moveHistory = game.history({ verbose: true }).reduce((acc: any[], move, i) => {
    if (i % 2 === 0) acc.push({ num: Math.floor(i / 2) + 1, white: move.san, black: '' });
    else acc[acc.length - 1].black = move.san;
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black font-serif text-amber-600 flex items-center gap-2 tracking-tight">
              <Brain size={32} className="text-amber-500" /> Algoritmo Mental
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500 hover:text-white">
              <X size={28} />
            </button>
          </div>

          <nav className="space-y-2 mb-6">
            <button 
              onClick={() => setView('play')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all ${view === 'play' ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-500/50' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Target size={20} /> Partida contra IA
            </button>
            <button 
              onClick={() => setView('puzzles')}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all ${view === 'puzzles' ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-500/50' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Trophy size={20} /> Desafíos Tácticos
            </button>
          </nav>

          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-1">
            <Controls 
              difficulty={difficulty} 
              setDifficulty={setDifficulty}
              playerColor={playerColor}
              setPlayerColor={setPlayerColor}
              onReset={resetGame}
              onAnalyze={runAnalysis}
            />
            
            {analysis && (
              <div className="p-4 bg-amber-900/10 rounded-xl border border-amber-500/20 animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2 flex items-center gap-2">
                  <Info size={12} /> Perspectiva de IA
                </h3>
                <p className="text-sm text-slate-300 italic leading-snug">
                  "{analysis}"
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] text-center">
            Motor Gemini 3 Flash
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen relative bg-slate-950">
        <header className="h-16 border-b border-slate-900 flex items-center px-8 justify-between bg-slate-950/50 backdrop-blur-xl z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-6">
            <div className={`px-5 py-1.5 rounded-full text-[11px] font-black tracking-widest border transition-all ${game.turn() === 'w' ? 'bg-white text-black border-white' : 'bg-slate-800 text-white border-slate-700'}`}>
              {game.turn() === 'w' ? 'BLANCAS' : 'NEGRAS'}
            </div>
            {isAiThinking && (
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs animate-pulse">
                <Brain size={16} className="animate-spin-slow" />
                <span>EL ALGORITMO ESTÁ PENSANDO...</span>
              </div>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <History size={14} /> Partida Activa
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 flex items-center justify-center">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-8 flex flex-col items-center relative">
              {view === 'play' ? (
                <ChessBoard 
                  fen={game.fen()} 
                  onDrop={onDrop} 
                  playerColor={playerColor} 
                />
              ) : (
                <PuzzleView />
              )}

              {pendingPromotion && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-sm animate-in fade-in">
                  <div className="bg-slate-900 p-10 rounded-3xl border-2 border-amber-600/50 shadow-[0_0_50px_rgba(217,119,6,0.2)] text-center">
                    <h3 className="text-2xl font-black text-amber-500 mb-8 uppercase tracking-tighter">Promocionar Peón</h3>
                    <div className="flex gap-6">
                      {[
                        { id: 'q', img: '1/1/Chess_qlt45.svg' },
                        { id: 'r', img: '7/7/Chess_rlt45.svg' },
                        { id: 'b', img: 'b/b1/Chess_blt45.svg' },
                        { id: 'n', img: '7/70/Chess_nlt45.svg' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handlePromotionSelection(p.id)}
                          className="w-24 h-24 bg-slate-800 hover:bg-amber-600 border-2 border-slate-700 hover:border-amber-400 rounded-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center p-3 shadow-xl group"
                        >
                          <img 
                            src={`https://upload.wikimedia.org/wikipedia/commons/${p.img}`} 
                            className="w-full h-full filter invert group-hover:invert-0" 
                            alt={p.id}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-4 space-y-6 h-full flex flex-col">
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 flex-1 flex flex-col shadow-2xl overflow-hidden min-h-[500px]">
                <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <ListOrdered size={16} className="text-amber-500" /> Registro de Jugadas
                  </h3>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded">
                    Total: {game.history().length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 scroll-smooth bg-slate-950/30">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] text-slate-600 border-b border-slate-800 uppercase font-black">
                        <th className="py-2 px-3 w-12 text-center">#</th>
                        <th className="py-2 px-3">Blancas</th>
                        <th className="py-2 px-3">Negras</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-sm">
                      {moveHistory.map((row) => (
                        <tr key={row.num} className="border-b border-slate-900 hover:bg-amber-500/5 transition-colors group">
                          <td className="py-2.5 px-3 text-center text-slate-600 font-bold group-hover:text-amber-500 transition-colors">{row.num}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-200">{row.white}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-400">{row.black}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div ref={historyEndRef} />
                  
                  {game.history().length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 py-20 opacity-30 gap-4">
                      <History size={48} />
                      <p className="text-xs font-black uppercase tracking-widest">Esperando inicio...</p>
                    </div>
                  )}
                </div>
              </div>

              {game.isGameOver() && (
                <div className="bg-amber-600 border border-amber-400 p-8 rounded-2xl text-center shadow-[0_20px_50px_rgba(217,119,6,0.3)] animate-in slide-in-from-top-10 duration-500">
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                    {game.isCheckmate() ? 'JAQUE MATE' : game.isDraw() ? 'TABLAS' : 'FIN'}
                  </h2>
                  <p className="text-amber-100 font-bold mb-6 text-sm">
                    {game.turn() === 'w' ? 'Victoria para las Negras' : 'Victoria para las Blancas'}
                  </p>
                  <button 
                    onClick={resetGame}
                    className="w-full bg-white text-amber-600 hover:bg-slate-100 font-black py-4 rounded-xl transition-all shadow-xl active:scale-95 text-lg uppercase tracking-tight"
                  >
                    Revancha Inmediata
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
