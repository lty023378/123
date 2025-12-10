
import React, { useState } from 'react';
import { ANIMALS } from '../constants';
import { Search, Map, ArrowLeft, Lightbulb, X } from 'lucide-react';

interface ExploreGameProps {
  onComplete: (foundAnimals: string[]) => void;
  onBack: (foundAnimals: string[]) => void;
  unlockedAnimals: string[];
}

const ExploreGame: React.FC<ExploreGameProps> = ({ onComplete, onBack, unlockedAnimals }) => {
  const [found, setFound] = useState<string[]>(unlockedAnimals);
  const [justFound, setJustFound] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [shakingId, setShakingId] = useState<string | null>(null);

  // Positions for animals
  const animalPositions: Record<string, { top: string; left: string; emoji: string }> = {
    frog: { top: '75%', left: '20%', emoji: '🐸' },
    heron: { top: '30%', left: '60%', emoji: '🐦' },
    cricket: { top: '55%', left: '85%', emoji: '🦗' }
  };

  // Distraction items (bushes, rocks)
  const distractions = [
      { id: 'd1', top: '70%', left: '10%', emoji: '🌿' },
      { id: 'd2', top: '80%', left: '25%', emoji: '🪨' },
      { id: 'd3', top: '40%', left: '50%', emoji: '🌾' },
      { id: 'd4', top: '25%', left: '65%', emoji: '☁️' },
      { id: 'd5', top: '60%', left: '80%', emoji: '🌿' },
      { id: 'd6', top: '85%', left: '90%', emoji: '🪨' },
  ];

  const handleFind = (id: string) => {
    if (!found.includes(id)) {
      const newFound = [...found, id];
      setFound(newFound);
      setJustFound(id);
      
      if (newFound.length === ANIMALS.length) {
        setTimeout(() => onComplete(newFound), 2500);
      }
    }
  };

  const handleDistraction = (id: string) => {
      setShakingId(id);
      setTimeout(() => setShakingId(null), 500);
  };

  const handleHint = () => {
      setHintActive(true);
      setTimeout(() => setHintActive(false), 3000); 
  };

  return (
    <div className="flex flex-col h-full bg-green-100 relative select-none">
      {/* Top UI */}
      <div className="absolute top-4 left-4 z-20 flex gap-2 w-[calc(100%-2rem)] pointer-events-none">
          <button 
            onClick={() => onBack(found)}
            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition shrink-0 pointer-events-auto active:scale-95"
          >
              <ArrowLeft size={24} className="text-gray-700"/>
          </button>
          <div className="bg-white/90 p-2 px-4 rounded-2xl backdrop-blur shadow-lg flex-1 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
                <Map size={20} className="text-green-600" /> 
                <div>
                    <h2 className="text-sm font-bold text-green-800 leading-none">寻找生物</h2>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">进度 {found.length}/{ANIMALS.length}</p>
                </div>
            </div>
            {/* Mini Progress Dots */}
            <div className="flex gap-1">
                {ANIMALS.map(a => (
                    <div key={a.id} className={`w-2 h-2 rounded-full ${found.includes(a.id) ? 'bg-green-500' : 'bg-gray-300'}`} />
                ))}
            </div>
          </div>
          <button 
             onClick={handleHint}
             disabled={found.length === ANIMALS.length}
             className="bg-yellow-400 p-2 rounded-full shadow-lg hover:bg-yellow-300 transition shrink-0 pointer-events-auto active:scale-95"
          >
              <Lightbulb size={24} className={`text-white drop-shadow-sm ${hintActive ? 'animate-pulse' : ''}`} />
          </button>
      </div>

      {/* Game Map Area */}
      <div className="flex-1 relative overflow-hidden bg-blue-100">
        {/* Background Image Layer */}
        <img 
            src="https://images.unsplash.com/photo-1547843491-c426f4f24c3c?q=80&w=1000" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            alt="Wetland Background"
        />
        
        {/* Decorative Overlay Gradient (Vignette) */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 pointer-events-none"></div>

        {/* Distractions */}
        {distractions.map(d => (
            <button
                key={d.id}
                onClick={() => handleDistraction(d.id)}
                style={{ top: d.top, left: d.left }}
                className={`absolute w-12 h-12 text-4xl transform -translate-x-1/2 -translate-y-1/2 transition-transform 
                    ${shakingId === d.id ? 'animate-shake' : 'hover:scale-110'}
                `}
            >
                {d.emoji}
                {shakingId === d.id && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/50 text-white px-2 py-1 rounded whitespace-nowrap animate-fade-up">
                        空的!
                    </span>
                )}
            </button>
        ))}

        {/* Animals */}
        {ANIMALS.map((animal) => {
          const pos = animalPositions[animal.id];
          const isFound = found.includes(animal.id);
          if (!pos) return null;

          return (
            <button
              key={animal.id}
              onClick={() => handleFind(animal.id)}
              disabled={isFound}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute w-20 h-20 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700
                ${isFound 
                    ? 'opacity-100 scale-125 z-10 cursor-default' 
                    : 'opacity-40 grayscale blur-[1px] hover:opacity-80 hover:scale-110 hover:blur-0 cursor-pointer animate-breathe z-0'
                }
              `}
            >
              <span className={`text-6xl filter drop-shadow-xl select-none ${isFound ? 'animate-bounce-small' : ''}`}>
                {pos.emoji}
              </span>
              
              {/* Hint Effect */}
              {(!isFound && hintActive) && (
                <span className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping"></span>
              )}
              
              {/* Name Tag (Only when found) */}
              {isFound && (
                  <span className="absolute -bottom-4 bg-white/80 px-2 py-0.5 rounded-full text-xs font-bold text-green-800 shadow-sm whitespace-nowrap animate-pop-in">
                      {animal.name}
                  </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Success Modal */}
      {justFound && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
            <div className="bg-white rounded-3xl p-6 shadow-2xl animate-pop-up flex flex-col items-center max-w-sm w-full relative overflow-hidden">
                {/* Background beams */}
                <div className="absolute inset-0 bg-yellow-50 -z-10"></div>
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-200 rounded-full blur-3xl opacity-50"></div>
                
                <button 
                    onClick={() => setJustFound(null)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                <div className="text-8xl mb-4 animate-bounce">
                    {animalPositions[justFound]?.emoji}
                </div>
                
                <h3 className="text-2xl font-black text-green-800 mb-1">
                    找到啦！
                </h3>
                <div className="text-xl font-bold text-green-600 mb-4">
                    {ANIMALS.find(a => a.id === justFound)?.name}
                </div>
                
                <p className="text-gray-600 text-center text-sm bg-green-50 p-3 rounded-xl mb-6 leading-relaxed">
                    {ANIMALS.find(a => a.id === justFound)?.fact}
                </p>

                <button 
                    onClick={() => setJustFound(null)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95"
                >
                    太棒了！
                </button>
            </div>
        </div>
      )}

      <style>{`
        @keyframes breathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        .animate-breathe {
            animation: breathe 3s ease-in-out infinite;
        }
        @keyframes bounce-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-small {
            animation: bounce-small 2s infinite;
        }
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, -50%) rotate(-10deg); }
            75% { transform: translate(-50%, -50%) rotate(10deg); }
        }
        .animate-shake {
            animation: shake 0.3s ease-in-out;
        }
        @keyframes fade-up {
            0% { opacity: 0; transform: translate(-50%, 10px); }
            100% { opacity: 1; transform: translate(-50%, -20px); }
        }
        .animate-fade-up {
            animation: fade-up 0.5s ease-out forwards;
        }
        @keyframes pop-in {
            0% { transform: scale(0); }
            80% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        .animate-pop-in {
            animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes pop-up {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-up {
            animation: pop-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default ExploreGame;
