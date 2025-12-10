
import React, { useState } from 'react';
import { ANIMALS } from '../constants';
import { Volume2, CheckCircle, XCircle, Play } from 'lucide-react';

interface AudioChallengeProps {
  onComplete: () => void;
}

const AudioChallenge: React.FC<AudioChallengeProps> = ({ onComplete }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pick 3 animals for the rounds
  const rounds = ANIMALS.slice(0, 3);
  const currentAnimal = rounds[currentRound];

  const playSound = () => {
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(currentAnimal.soundDescription);
    utterance.lang = 'zh-CN';
    
    // Tweak voice settings to mimic animals
    switch (currentAnimal.id) {
        case 'frog':
            utterance.pitch = 0.6; // Deep
            utterance.rate = 0.8;  // Slowish
            break;
        case 'heron':
            utterance.pitch = 0.4; // Very Deep/Raspy simulation
            utterance.rate = 0.6;  // Slow
            break;
        case 'cricket':
            utterance.pitch = 1.8; // High pitched
            utterance.rate = 1.5;  // Fast
            break;
        default:
            utterance.pitch = 1;
            utterance.rate = 1;
    }

    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleGuess = (animalId: string) => {
    if (animalId === currentAnimal.id) {
      setShowFeedback('correct');
      setTimeout(() => {
        if (currentRound < rounds.length - 1) {
          setCurrentRound(prev => prev + 1);
          setShowFeedback(null);
        } else {
          onComplete();
        }
      }, 1500);
    } else {
      setShowFeedback('wrong');
      setTimeout(() => setShowFeedback(null), 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-green-50 p-4">
      <h2 className="text-2xl font-bold text-green-800 text-center mb-6 mt-4">
        任务1：听声辨位
      </h2>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8 text-center bg-green-100 p-8 rounded-full shadow-inner relative">
          <p className="text-gray-600 mb-4 text-lg font-medium">点击喇叭，猜猜是谁？</p>
          <button
            onClick={playSound}
            disabled={isPlaying}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all border-4 border-white ${
              isPlaying ? 'bg-green-400 scale-110 animate-pulse' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isPlaying ? (
                <Volume2 size={48} className="text-white animate-bounce" />
            ) : (
                <Play size={48} className="text-white ml-2" />
            )}
          </button>
          
          {/* Sound waves animation */}
          {isPlaying && (
            <>
                <div className="absolute inset-0 border-4 border-green-300 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping opacity-50 delay-150"></div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {ANIMALS.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleGuess(animal.id)}
              className="bg-white p-4 rounded-xl shadow-md border-2 border-transparent hover:border-green-400 transition flex flex-col items-center group active:scale-95"
            >
              <div className="text-5xl mb-3 transform group-hover:-translate-y-1 transition">
                {animal.id === 'frog' ? '🐸' : animal.id === 'heron' ? '🐦' : '🦗'}
              </div>
              <span className="font-bold text-gray-700">{animal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {showFeedback === 'correct' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center animate-float shadow-2xl">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4 drop-shadow-lg" />
            <h3 className="text-3xl font-bold text-green-800 mb-2">回答正确！</h3>
            <p className="text-gray-600 text-lg">真棒！就是{currentAnimal.name}！</p>
          </div>
        </div>
      )}

      {showFeedback === 'wrong' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
           <div className="bg-white p-8 rounded-3xl flex flex-col items-center shadow-2xl animate-shake">
            <XCircle className="text-red-500 w-20 h-20 mb-4 drop-shadow-lg" />
            <h3 className="text-3xl font-bold text-red-800 mb-2">不对哦</h3>
            <p className="text-gray-600 text-lg">再仔细听一听~</p>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AudioChallenge;
