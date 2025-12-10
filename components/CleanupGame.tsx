
import React, { useState, useEffect } from 'react';
import { TRASH_ITEMS } from '../constants';
import { TrashItem } from '../types';
import { Trash2, Recycle, AlertTriangle, Apple, ArrowLeft } from 'lucide-react';

interface CleanupGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const CleanupGame: React.FC<CleanupGameProps> = ({ onComplete, onBack }) => {
  const [queue, setQueue] = useState<TrashItem[]>([...TRASH_ITEMS].sort(() => Math.random() - 0.5));
  const [currentItem, setCurrentItem] = useState<TrashItem | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !currentItem) {
      setCurrentItem(queue[0]);
      setQueue(prev => prev.slice(1));
    } else if (queue.length === 0 && !currentItem) {
       setTimeout(onComplete, 1500);
    }
  }, [queue, currentItem, onComplete]);

  const handleSort = (binType: 'recycle' | 'harmful' | 'organic') => {
    if (!currentItem) return;

    if (currentItem.type === binType) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setTimeout(() => {
        setFeedback(null);
        setCurrentItem(null); // Trigger next item
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (!currentItem && queue.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-green-100 p-8 text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">清理完成！</h2>
        <p className="text-xl text-green-700">湿地变干净了！</p>
        <div className="text-6xl mt-4 animate-bounce">✨🏞️✨</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-blue-50 relative overflow-hidden">
      <div className="p-4 bg-white/80 backdrop-blur shadow-sm z-10">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                 <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                     <ArrowLeft className="text-gray-600" />
                 </button>
                 <h2 className="text-xl font-bold text-green-800">任务4：湿地大扫除</h2>
            </div>
            <span className="bg-yellow-200 px-3 py-1 rounded-full text-yellow-800 text-sm">得分: {score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Conveyor Belt / Water Flow */}
        <div className="absolute inset-x-0 top-1/2 h-24 bg-blue-200 -z-10 transform -translate-y-1/2 border-y-4 border-blue-300"></div>

        {/* Current Trash Item */}
        {currentItem && (
          <div className={`
             w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4
             transition-all duration-300
             ${feedback === 'correct' ? 'scale-0 opacity-0 bg-green-200 border-green-500' : ''}
             ${feedback === 'wrong' ? 'animate-shake border-red-500 bg-red-100' : 'border-gray-200 animate-float'}
          `}>
             <span className="text-6xl">{currentItem.emoji}</span>
          </div>
        )}
        {currentItem && (
             <div className="mt-4 bg-white/60 px-4 py-1 rounded-full font-bold text-gray-600">
                 这是：{currentItem.name}
             </div>
        )}
      </div>

      {/* Bins */}
      <div className="grid grid-cols-3 gap-2 p-4 pb-8 bg-white/50 z-10">
        <button 
          onClick={() => handleSort('recycle')}
          className="flex flex-col items-center p-4 bg-blue-100 rounded-xl border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 transition"
        >
          <Recycle className="w-8 h-8 text-blue-600 mb-1" />
          <span className="font-bold text-blue-800 text-sm">可回收</span>
        </button>

        <button 
          onClick={() => handleSort('organic')}
          className="flex flex-col items-center p-4 bg-green-100 rounded-xl border-b-4 border-green-300 active:border-b-0 active:translate-y-1 transition"
        >
          <Apple className="w-8 h-8 text-green-600 mb-1" />
          <span className="font-bold text-green-800 text-sm">厨余</span>
        </button>

         <button 
          onClick={() => handleSort('harmful')}
          className="flex flex-col items-center p-4 bg-red-100 rounded-xl border-b-4 border-red-300 active:border-b-0 active:translate-y-1 transition"
        >
          <AlertTriangle className="w-8 h-8 text-red-600 mb-1" />
          <span className="font-bold text-red-800 text-sm">有害</span>
        </button>
      </div>

      {/* Shake Animation Style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CleanupGame;
