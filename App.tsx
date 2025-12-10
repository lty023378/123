
import React, { useState, useEffect } from 'react';
import { GameState } from './types';
import IntroStory from './components/IntroStory';
import PurifyGame from './components/PurifyGame';
import ExploreGame from './components/ExploreGame';
import CleanupGame from './components/CleanupGame';
import FoodChainGame from './components/FoodChainGame';
import EcoSimGame from './components/EcoSimGame';
import Biodex from './components/Biodex';
import DragonChat from './components/DragonChat';
import AmbientPlayer from './components/AmbientPlayer';
import SettingsModal from './components/SettingsModal';
import VisualEffects, { WeatherType } from './components/VisualEffects';
import { Compass, BookOpen, MessageCircle, Play, Hammer, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [unlockedAnimals, setUnlockedAnimals] = useState<string[]>([]);
  
  // Settings State
  const [volume, setVolume] = useState(0.5);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Atmosphere State
  const [weather, setWeather] = useState<WeatherType>('off');
  
  // Game Event State for Global Effects
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Persistence Logic ---
  useEffect(() => {
    try {
      const savedVol = localStorage.getItem('wetland_volume');
      if (savedVol) setVolume(parseFloat(savedVol));
      
      const savedMusic = localStorage.getItem('wetland_music');
      if (savedMusic) setMusicEnabled(savedMusic === 'true');

      const savedAnimals = localStorage.getItem('wetland_animals');
      if (savedAnimals) setUnlockedAnimals(JSON.parse(savedAnimals));
    } catch (e) {
      console.error("Failed to load save data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wetland_volume', volume.toString());
    localStorage.setItem('wetland_music', String(musicEnabled));
  }, [volume, musicEnabled]);

  useEffect(() => {
    localStorage.setItem('wetland_animals', JSON.stringify(unlockedAnimals));
  }, [unlockedAnimals]);
  
  const startGame = () => {
      setGameState(GameState.INTRO);
      if (musicEnabled) setWeather('sunny'); // Auto start sunny vibes
  };
  const finishIntro = () => setGameState(GameState.HUB);

  const handleResetProgress = () => {
    setUnlockedAnimals([]);
    localStorage.removeItem('wetland_animals');
    setGameState(GameState.MENU);
  };

  const triggerConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.MENU:
        return (
          <div className="h-full flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1000')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
            
            {/* Responsive Container */}
            <div className="relative z-10 text-center p-8 bg-white/90 rounded-3xl shadow-2xl m-4 w-full max-w-md sm:max-w-lg md:max-w-xl transition-all">
              <h1 className="text-5xl sm:text-7xl font-extrabold text-green-700 mb-2 drop-shadow-sm font-[ZCOOL KuaiLe]">熊畈村</h1>
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-8 tracking-wide">湿地大冒险</h2>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
              >
                <Play fill="currentColor" /> 开始探险
              </button>
              <div className="mt-8 flex justify-center">
                 <button 
                   onClick={() => setIsSettingsOpen(true)}
                   className="text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full text-sm font-bold"
                 >
                   <Settings size={16} /> 设置
                 </button>
              </div>
              <p className="mt-6 text-gray-500 text-sm sm:text-base font-medium">适合 6-12 岁小朋友的生态科普</p>
            </div>
          </div>
        );

      case GameState.INTRO:
        return <IntroStory onComplete={finishIntro} />;

      case GameState.HUB:
        return (
          <div className="h-full flex flex-col bg-green-50">
            <header className="bg-green-500 p-4 text-white shadow-md flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-xl sm:text-2xl tracking-wider">熊畈村探险中心</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-green-700 px-3 py-1 rounded-full text-sm font-medium hidden sm:block">
                        收集进度: {unlockedAnimals.length}/3
                    </div>
                    <button 
                       onClick={() => setIsSettingsOpen(true)}
                       className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>
            
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
                {/* Main Feature: Eco Sim */}
                <button 
                    onClick={() => setGameState(GameState.GAME_ECO_SIM)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 sm:p-10 rounded-3xl shadow-xl border-4 border-blue-300 transform transition active:scale-[0.99] text-left relative overflow-hidden group hover:shadow-2xl flex flex-col sm:block"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                            <Hammer className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                            <h2 className="text-2xl sm:text-4xl font-bold">生态修复模拟器</h2>
                        </div>
                        <p className="text-blue-100 text-sm sm:text-xl max-w-2xl mb-4 sm:mb-0">像设计师一样规划湿地，挑战完美生态！</p>
                        <div className="mt-2 sm:mt-6 bg-white/20 inline-block px-4 py-2 rounded-full text-xs sm:text-base font-bold backdrop-blur-md">
                            NEW! AI 智能助手已上线
                        </div>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-40px] text-8xl sm:text-9xl opacity-20 rotate-12 group-hover:rotate-0 transition duration-500 transform scale-150 sm:scale-100">
                        🏗️
                    </div>
                </button>

                <div>
                  <h3 className="font-bold text-gray-500 text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    训练小游戏
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => setGameState(GameState.GAME_PURIFY)} className="game-card bg-blue-100 border-blue-200 hover:bg-blue-200 group">
                        <span className="text-4xl group-hover:scale-110 transition">💧</span>
                        <div className="flex-1 text-left ml-4">
                            <h3 className="font-bold text-blue-900 text-lg">净化水源</h3>
                            <p className="text-sm text-blue-700">植物净水挑战</p>
                        </div>
                    </button>

                    <button onClick={() => setGameState(GameState.GAME_EXPLORE)} className="game-card bg-green-100 border-green-200 hover:bg-green-200 group">
                        <span className="text-4xl group-hover:scale-110 transition">🔍</span>
                        <div className="flex-1 text-left ml-4">
                            <h3 className="font-bold text-green-900 text-lg">寻找生物</h3>
                            <p className="text-sm text-green-700">它们藏在哪里呢？</p>
                        </div>
                    </button>

                    <button onClick={() => setGameState(GameState.GAME_CLEANUP)} className="game-card bg-red-100 border-red-200 hover:bg-red-200 group">
                        <span className="text-4xl group-hover:scale-110 transition">♻️</span>
                        <div className="flex-1 text-left ml-4">
                            <h3 className="font-bold text-red-900 text-lg">湿地大扫除</h3>
                            <p className="text-sm text-red-700">垃圾分类保护环境</p>
                        </div>
                    </button>

                    <button onClick={() => setGameState(GameState.GAME_CHAIN)} className="game-card bg-amber-100 border-amber-200 hover:bg-amber-200 group">
                        <span className="text-4xl group-hover:scale-110 transition">🔗</span>
                        <div className="flex-1 text-left ml-4">
                            <h3 className="font-bold text-amber-900 text-lg">食物链拼图</h3>
                            <p className="text-sm text-amber-700">学习生态关系</p>
                        </div>
                    </button>
                  </div>
                </div>
              </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bg-white p-2 flex justify-center gap-8 sm:gap-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] shrink-0 z-10 pb-safe">
                <button onClick={() => setGameState(GameState.BIODEX)} className="flex flex-col items-center p-2 text-gray-500 hover:text-green-600 transition min-w-[64px]">
                    <BookOpen size={24} className="sm:w-7 sm:h-7" />
                    <span className="text-[10px] sm:text-xs font-bold mt-1">图鉴</span>
                </button>
                 <button onClick={() => setGameState(GameState.HUB)} className="flex flex-col items-center p-2 text-green-600 min-w-[64px]">
                    <Compass size={24} className="sm:w-7 sm:h-7" />
                    <span className="text-[10px] sm:text-xs font-bold mt-1">地图</span>
                </button>
                 <button onClick={() => setGameState(GameState.CHAT)} className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-500 transition min-w-[64px]">
                    <MessageCircle size={24} className="sm:w-7 sm:h-7" />
                    <span className="text-[10px] sm:text-xs font-bold mt-1">问水龙</span>
                </button>
            </nav>
          </div>
        );

      case GameState.GAME_ECO_SIM:
        return (
            <EcoSimGame 
                onBack={() => setGameState(GameState.HUB)} 
                onWin={triggerConfetti}
            />
        );

      case GameState.GAME_PURIFY:
        return (
            <PurifyGame 
                onComplete={() => {
                    triggerConfetti();
                    setGameState(GameState.HUB);
                }} 
                onBack={() => setGameState(GameState.HUB)}
            />
        );

      case GameState.GAME_EXPLORE:
        return (
            <ExploreGame 
                unlockedAnimals={unlockedAnimals} 
                onComplete={(found) => {
                    setUnlockedAnimals(found);
                    triggerConfetti();
                    setGameState(GameState.HUB);
                }}
                onBack={(currentFound) => {
                    const merged = Array.from(new Set([...unlockedAnimals, ...currentFound]));
                    setUnlockedAnimals(merged);
                    setGameState(GameState.HUB);
                }}
            />
        );
      
      case GameState.GAME_CLEANUP:
        return (
            <CleanupGame 
                onComplete={() => {
                    triggerConfetti();
                    setGameState(GameState.HUB);
                }} 
                onBack={() => setGameState(GameState.HUB)}
            />
        );
      
      case GameState.GAME_CHAIN:
        return (
            <FoodChainGame 
                onComplete={() => {
                    triggerConfetti();
                    setGameState(GameState.HUB);
                }} 
                onBack={() => setGameState(GameState.HUB)}
            />
        );

      case GameState.BIODEX:
        return <Biodex unlockedAnimals={unlockedAnimals} onBack={() => setGameState(GameState.HUB)} />;
      
      case GameState.CHAT:
        return <DragonChat onClose={() => setGameState(GameState.HUB)} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-white overflow-hidden relative font-sans text-gray-900 select-none flex flex-col">
      <VisualEffects weather={weather} showConfetti={showConfetti} />
      
      <AmbientPlayer 
        globalVolume={volume} 
        enabled={musicEnabled} 
        currentType={weather}
        onTypeChange={setWeather}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        volume={volume}
        onVolumeChange={setVolume}
        musicEnabled={musicEnabled}
        onMusicToggle={() => {
            const newState = !musicEnabled;
            setMusicEnabled(newState);
            if (!newState) setWeather('off');
        }}
        onResetProgress={handleResetProgress}
      />

      <style>{`
        .game-card {
            display: flex;
            align-items: center;
            padding: 1.5rem;
            border-radius: 1rem;
            border-width: 2px;
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .game-card:active {
            transform: scale(0.98);
        }
        /* Mobile safe area for bottom nav */
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
      {renderContent()}
    </div>
  );
};

export default App;
