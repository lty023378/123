
import React, { useEffect, useState, useCallback } from 'react';

// --- Types ---
export type WeatherType = 'sunny' | 'rain' | 'wind' | 'off';

interface VisualEffectsProps {
  weather: WeatherType;
  showConfetti?: boolean;
}

// --- Sub-components ---

const RainOverlay: React.FC = () => {
  // Generate random rain drops
  const drops = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {drops.map(d => (
        <div 
          key={d.id}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
    </div>
  );
};

const WindOverlay: React.FC = () => {
  const leaves = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {leaves.map(l => (
        <div 
          key={l.id}
          className="leaf"
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`
          }}
        />
      ))}
    </div>
  );
};

const SunnyOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Sun flare top right */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-yellow-200/10 to-transparent"></div>
    </div>
  );
};

const ClickSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  const handleGlobalClick = useCallback((e: MouseEvent) => {
    const id = Date.now();
    const colors = ['#FCD34D', '#34D399', '#60A5FA', '#F472B6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    setSparkles(prev => [...prev, { id, x: e.clientX, y: e.clientY, color }]);
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [handleGlobalClick]);

  return (
    <>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="click-sparkle fixed"
          style={{ 
            left: s.x, 
            top: s.y,
            color: s.color 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
      ))}
    </>
  );
};

const Confetti: React.FC = () => {
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    bg: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 1,
    duration: 2 + Math.random() * 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(p => (
        <div 
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.bg,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// --- Main Component ---

const VisualEffects: React.FC<VisualEffectsProps> = ({ weather, showConfetti }) => {
  return (
    <>
      {weather === 'rain' && <RainOverlay />}
      {weather === 'wind' && <WindOverlay />}
      {weather === 'sunny' && <SunnyOverlay />}
      
      <ClickSparkles />
      
      {showConfetti && <Confetti />}
    </>
  );
};

export default VisualEffects;
