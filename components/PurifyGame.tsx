
import React, { useState, useEffect } from 'react';
import { PLANTS } from '../constants';
import { Plant } from '../types';
import { Droplets, Sprout, ShieldCheck, ArrowLeft } from 'lucide-react';

interface PurifyGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const PurifyGame: React.FC<PurifyGameProps> = ({ onComplete, onBack }) => {
  const [pollutionLevel, setPollutionLevel] = useState(100);
  const [planted, setPlanted] = useState<string[]>([]);
  const [message, setMessage] = useState("水太脏了！快种些植物来净化它！");

  useEffect(() => {
    if (pollutionLevel <= 0) {
      setMessage("太棒了！水变清澈了！");
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [pollutionLevel, onComplete]);

  const handlePlant = (plant: Plant) => {
    if (pollutionLevel <= 0) return;
    
    setPlanted(prev => [...prev, plant.id]);
    setPollutionLevel(prev => Math.max(0, prev - plant.power));
    
    // Random encouraging message
    const encouragements = ["做得好！", "继续加油！", "水变清了一点！"];
    setMessage(`${encouragements[Math.floor(Math.random() * encouragements.length)]} 种下了${plant.name}。`);
  };

  return (
    <div className="flex flex-col h-full bg-blue-50 relative">
        {/* Header / Status */}
        <div className="p-4 bg-white shadow-md z-10">
            <div className="flex items-center gap-3 mb-4">
                 <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                     <ArrowLeft className="text-gray-600" />
                 </button>
                 <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                    <Droplets className="text-blue-500" /> 任务2：净化水源
                </h2>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
                <span className="font-bold text-gray-600 text-sm w-20">污染程度</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                    <div 
                        className={`h-full transition-all duration-700 ease-out ${pollutionLevel > 50 ? 'bg-gray-600' : 'bg-green-500'}`}
                        style={{ width: `${pollutionLevel}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                        {pollutionLevel}%
                    </span>
                </div>
            </div>
            <p className="text-center text-blue-600 font-medium text-sm animate-pulse min-h-[1.25rem]">
                {message}
            </p>
        </div>

        {/* Visual Area */}
        <div className="flex-1 relative overflow-hidden transition-colors duration-1000"
             style={{ backgroundColor: pollutionLevel > 60 ? '#5d5d4d' : pollutionLevel > 30 ? '#8ba896' : '#bfdbfe' }}
        >
            {/* Background Texture/Animation for water */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/water.png')] animate-pulse"></div>

            {/* Planted Items Display */}
            <div className="absolute inset-0 flex items-end justify-center p-6 gap-4 flex-wrap content-end">
                {planted.map((pid, idx) => {
                    const plant = PLANTS.find(p => p.id === pid);
                    return (
                        <div key={idx} className="animate-pop-up flex flex-col items-center transform transition hover:scale-110">
                            <span className="text-4xl sm:text-6xl filter drop-shadow-xl">🌿</span>
                            <span className="bg-white/70 px-2 py-0.5 rounded text-xs font-bold mt-1 shadow-sm">{plant?.name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Success Overlay */}
            {pollutionLevel <= 0 && (
                <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce-in">
                        <ShieldCheck size={80} className="text-green-500 mb-4" />
                        <h3 className="text-3xl font-bold text-green-800">任务完成！</h3>
                        <p className="text-gray-500 mt-2">湿地重新焕发了生机</p>
                    </div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="bg-white border-t border-gray-200 p-4">
            <h3 className="font-bold text-gray-500 text-sm mb-3">点击植物进行种植：</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PLANTS.map((plant) => (
                    <button
                        key={plant.id}
                        onClick={() => handlePlant(plant)}
                        disabled={pollutionLevel <= 0}
                        className="flex flex-col items-center p-3 rounded-xl border-2 border-green-100 hover:border-green-400 hover:bg-green-50 transition active:scale-95 shadow-sm group"
                    >
                        <div className="bg-green-100 p-3 rounded-full mb-2 group-hover:bg-green-200 transition">
                            <Sprout size={24} className="text-green-700" />
                        </div>
                        <span className="font-bold text-gray-800">{plant.name}</span>
                        <span className="text-xs text-green-600 font-bold">净化力 {plant.power}</span>
                    </button>
                ))}
            </div>
        </div>

        <style>{`
            @keyframes pop-up {
                0% { transform: translateY(100px) scale(0); opacity: 0; }
                80% { transform: translateY(-10px) scale(1.1); opacity: 1; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-pop-up {
                animation: pop-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            @keyframes bounce-in {
                 0% { transform: scale(0); }
                 60% { transform: scale(1.1); }
                 100% { transform: scale(1); }
            }
            .animate-bounce-in {
                animation: bounce-in 0.5s ease-out;
            }
        `}</style>
    </div>
  );
};

export default PurifyGame;
