import React from 'react';
import { ANIMALS } from '../constants';
import { ArrowLeft, Star } from 'lucide-react';

interface BiodexProps {
  unlockedAnimals: string[];
  onBack: () => void;
}

const Biodex: React.FC<BiodexProps> = ({ unlockedAnimals, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-yellow-50 overflow-y-auto">
      <div className="p-4 flex items-center bg-yellow-400 text-yellow-900 shadow-md sticky top-0 z-10">
        <button onClick={onBack} className="mr-4 hover:bg-yellow-500 p-2 rounded-full transition">
          <ArrowLeft />
        </button>
        <h2 className="text-2xl font-bold">湿地生物图鉴</h2>
      </div>

      <div className="p-4 grid gap-4">
        {ANIMALS.map((animal) => {
          const isUnlocked = unlockedAnimals.includes(animal.id);
          return (
            <div
              key={animal.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                isUnlocked ? 'border-yellow-400' : 'border-gray-200 grayscale opacity-70'
              }`}
            >
              <div className="flex">
                <div className="w-1/3 h-32 bg-gray-200 relative">
                   {isUnlocked ? (
                       <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
                   ) : (
                       <div className="flex items-center justify-center h-full text-4xl">?</div>
                   )}
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {isUnlocked ? animal.name : '???'}
                    {isUnlocked && <Star size={16} className="text-yellow-500 fill-current" />}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {isUnlocked ? animal.fact : '去探索模式寻找它吧！'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-6 text-center text-gray-500 mt-auto">
         收集进度: {unlockedAnimals.length} / {ANIMALS.length}
      </div>
    </div>
  );
};

export default Biodex;