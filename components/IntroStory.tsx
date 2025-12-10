
import React, { useState, useEffect } from 'react';
import { STORY_INTRO } from '../constants';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IntroStoryProps {
  onComplete: () => void;
}

const IntroStory: React.FC<IntroStoryProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  const fullText = STORY_INTRO[step];

  // Typewriter effect
  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[charIndex]);
        setCharIndex(prev => prev + 1);
      }, 50); // Speed of typing
      return () => clearTimeout(timer);
    }
  }, [charIndex, fullText]);

  // Reset when step changes
  useEffect(() => {
    setDisplayedText('');
    setCharIndex(0);
  }, [step]);

  const handleNext = () => {
    if (charIndex < fullText.length) {
      // If clicked while typing, show full text immediately
      setDisplayedText(fullText);
      setCharIndex(fullText.length);
    } else {
      if (step < STORY_INTRO.length - 1) {
        setStep(step + 1);
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-b from-blue-100 to-green-100 text-center" onClick={handleNext}>
      <div className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center mb-8 animate-float shadow-xl border-4 border-white">
        {/* Placeholder for Water Dragon Avatar */}
        <span className="text-6xl">🐉</span>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md relative bubble-pop min-h-[160px] flex flex-col justify-center">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Sparkles size={16} /> 水龙说
        </div>
        <p className="text-xl text-gray-700 leading-relaxed font-medium mt-2">
          {displayedText}
          {charIndex < fullText.length && <span className="animate-pulse">|</span>}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="mt-12 bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2"
      >
        {step < STORY_INTRO.length - 1 ? '继续' : '出发！'} <ArrowRight />
      </button>
      
      <p className="text-gray-400 text-xs mt-4">点击屏幕加速显示</p>
    </div>
  );
};

export default IntroStory;
