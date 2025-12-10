
import React, { useState, useEffect } from 'react';
import { FOOD_CHAINS } from '../constants';
import { ChainLevel } from '../types';
import { ArrowRight, Link, Check, RefreshCw, ArrowLeft } from 'lucide-react';

interface FoodChainGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const FoodChainGame: React.FC<FoodChainGameProps> = ({ onComplete, onBack }) => {
  const [level, setLevel] = useState(0);
  const [slots, setSlots] = useState<(ChainLevel | null)[]>([null, null, null]);
  const [options, setOptions] = useState<ChainLevel[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentChain = FOOD_CHAINS[level];

  // Initialize options scrambled
  useEffect(() => {
    if (currentChain) {
      setSlots([null, null, null]);
      setIsSuccess(false);
      setOptions([...currentChain.items].sort(() => Math.random() - 0.5));
    } else {
        onComplete();
    }
  }, [level, currentChain, onComplete]);

  const handleSelectOption = (item: ChainLevel) => {
    if (isSuccess) return;

    // Find first empty slot
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      const newSlots = [...slots];
      newSlots[emptyIndex] = item;
      setSlots(newSlots);
      setOptions(prev => prev.filter(o => o.id !== item.id));
      
      // Check win condition immediately if full
      if (emptyIndex === 2) {
         checkWin(newSlots);
      }
    }
  };

  const handleReset = () => {
    setSlots([null, null, null]);
    setOptions([...currentChain.items].sort(() => Math.random() - 0.5));
    setIsSuccess(false);
  };

  const checkWin = (currentSlots: (ChainLevel | null)[]) => {
     const isCorrect = currentSlots.every((slot, index) => slot?.id === currentChain.items[index].id);
     if (isCorrect) {
         setIsSuccess(true);
         setTimeout(() => {
             if (level < FOOD_CHAINS.length - 1) {
                 setLevel(prev => prev + 1);
             } else {
                 onComplete();
             }
         }, 1500);
     } else {
         // Auto reset if wrong after a short delay
         setTimeout(handleReset, 1000);
     }
  };

  if (!currentChain) return null;

  return (
    <div className="flex flex-col h-full bg-amber-50 p-4">
       <div className="flex items-center gap-2 mb-2">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                 <ArrowLeft className="text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                <Link size={24} /> 任务5：食物链拼图
            </h2>
       </div>
       <p className="text-amber-700 text-sm mb-6 bg-amber-100 p-2 rounded-lg">
           {currentChain.description}：谁吃谁？请按顺序排列。
       </p>

       {/* Puzzle Area */}
       <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 w-full justify-between px-2">
                {slots.map((slot, idx) => (
                    <React.Fragment key={idx}>
                        <div className={`
                            w-20 h-24 sm:w-24 sm:h-28 rounded-xl border-4 border-dashed flex flex-col items-center justify-center
                            transition-all duration-300
                            ${slot ? 'bg-white border-amber-400 border-solid shadow-md' : 'bg-amber-100/50 border-amber-300'}
                            ${isSuccess ? 'bg-green-100 border-green-500 scale-110' : ''}
                        `}>
                            {slot ? (
                                <>
                                    <span className="text-4xl mb-1">{slot.emoji}</span>
                                    <span className="text-xs font-bold text-gray-600">{slot.name}</span>
                                </>
                            ) : (
                                <span className="text-2xl text-amber-200 font-bold">{idx + 1}</span>
                            )}
                        </div>
                        {idx < 2 && <ArrowRight className="text-amber-400" size={20} />}
                    </React.Fragment>
                ))}
            </div>
            
            {isSuccess && (
                <div className="mt-8 flex items-center gap-2 text-green-600 font-bold text-xl animate-bounce">
                    <Check size={28} /> 拼对啦！
                </div>
            )}
       </div>

       {/* Options Area */}
       <div className="bg-white p-4 rounded-2xl shadow-up">
           <div className="flex justify-between items-center mb-4">
               <span className="font-bold text-gray-500 text-sm">点击下方生物填入空位：</span>
               <button onClick={handleReset} className="text-amber-500 hover:text-amber-700">
                   <RefreshCw size={20} />
               </button>
           </div>
           
           <div className="flex gap-4 justify-center">
               {options.map((item) => (
                   <button
                       key={item.id}
                       onClick={() => handleSelectOption(item)}
                       className="w-20 h-20 bg-amber-100 rounded-full flex flex-col items-center justify-center hover:bg-amber-200 hover:scale-110 transition shadow-sm"
                   >
                       <span className="text-3xl">{item.emoji}</span>
                       <span className="text-xs font-bold text-amber-900 mt-1">{item.name}</span>
                   </button>
               ))}
               {options.length === 0 && !isSuccess && (
                   <div className="text-red-400 text-sm font-bold pt-4">如果不正确，会自动重置哦...</div>
               )}
           </div>
       </div>
    </div>
  );
};

export default FoodChainGame;
