
import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Volume2, Music } from 'lucide-react';
import { WeatherType } from './VisualEffects';

interface AmbientPlayerProps {
  globalVolume: number;
  enabled: boolean;
  currentType: WeatherType;
  onTypeChange: (type: WeatherType) => void;
}

const TRACKS: Record<Exclude<WeatherType, 'off'>, { url: string; icon: React.ReactNode; label: string }> = {
  sunny: {
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3',
    icon: <Sun size={20} className="text-orange-500" />,
    label: '晴朗'
  },
  rain: {
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3',
    icon: <CloudRain size={20} className="text-blue-500" />,
    label: '下雨'
  },
  wind: {
    url: 'https://assets.mixkit.co/sfx/preview/mixkit-wind-in-the-trees-1174.mp3',
    icon: <Wind size={20} className="text-gray-500" />,
    label: '起风'
  }
};

const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ globalVolume, enabled, currentType, onTypeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Handle Playback Logic
  React.useEffect(() => {
    if (!enabled || currentType === 'off') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const track = TRACKS[currentType];
    
    // If we have an audio instance, check if url changed
    if (audioRef.current && audioRef.current.src !== track.url) {
        audioRef.current.pause();
        audioRef.current = null;
    }

    if (!audioRef.current) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = globalVolume; 
        audio.play().catch(e => console.log("Auto-play prevented", e));
        audioRef.current = audio;
    }

    return () => {
      // Cleanup only on unmount
    };
  }, [currentType, enabled]);

  // Handle Volume Change
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume;
    }
  }, [globalVolume]);

  if (!enabled) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col items-end gap-2">
      {/* Menu Options */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-2 flex flex-col gap-2 animate-float border border-white/50 origin-top-right transition-all">
          {(Object.keys(TRACKS) as Array<keyof typeof TRACKS>).map((type) => (
            <button
              key={type}
              onClick={() => {
                onTypeChange(type);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full ${
                currentType === type ? 'bg-green-100 ring-2 ring-green-400' : 'hover:bg-gray-100'
              }`}
            >
              {TRACKS[type].icon}
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{TRACKS[type].label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onTypeChange('off');
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all w-full ${
                currentType === 'off' ? 'bg-red-50 text-red-500 ring-2 ring-red-200' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <Volume2 size={20} />
            <span className="text-sm font-bold">静音</span>
          </button>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
          ${currentType !== 'off' ? 'bg-green-500 text-white animate-pulse' : 'bg-white text-gray-600'}
        `}
      >
        {currentType === 'off' ? <Music size={24} /> : <Volume2 size={24} />}
      </button>
      
      {currentType !== 'off' && (
          <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">
              {TRACKS[currentType as keyof typeof TRACKS].label}
          </span>
      )}
    </div>
  );
};

export default AmbientPlayer;
