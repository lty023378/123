
import React, { useState, useEffect } from 'react';
import { SIM_LEVELS, SIM_TOOLS, PLACEMENT_RULES } from '../constants';
import { SimCell, SimEntityType, TerrainType, SimTool } from '../types';
import { getGameHint, getEntityChat, getDailyNews, NewsData } from '../services/geminiService';
import { ArrowLeft, Lightbulb, Camera, RotateCcw, Wallet, Newspaper, MessageCircle } from 'lucide-react';

interface EcoSimGameProps {
  onBack: () => void;
  onWin: () => void;
}

interface FloatingText {
  id: number;
  row: number;
  col: number;
  text: string;
  type: 'cost' | 'earn' | 'score' | 'info';
}

const EcoSimGame: React.FC<EcoSimGameProps> = ({ onBack, onWin }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [grid, setGrid] = useState<SimCell[]>([]);
  const [budget, setBudget] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedTool, setSelectedTool] = useState<SimTool | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("点击工具开始修复湿地吧！");
  
  const [showNews, setShowNews] = useState(false);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [isGeneratingNews, setIsGeneratingNews] = useState(false);

  const [chatBubble, setChatBubble] = useState<{cellId: string, text: string} | null>(null);
  const [effects, setEffects] = useState<FloatingText[]>([]);

  const currentLevel = SIM_LEVELS[levelIndex];

  // Initialize Level
  useEffect(() => {
    startLevel(levelIndex);
  }, [levelIndex]);

  const startLevel = (idx: number) => {
    const lvl = SIM_LEVELS[idx];
    const initialCells: SimCell[] = [];
    
    // Create 4x4 Grid
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const preset = lvl.initialGrid.find(p => p.row === r && p.col === c);
        initialCells.push({
          row: r,
          col: c,
          terrain: preset?.terrain || 'deep_water',
          entity: preset?.entity || null
        });
      }
    }
    setGrid(initialCells);
    setBudget(lvl.budget);
    setScore(0);
    setAiMessage(lvl.missionDescription);
    setShowNews(false);
    setNewsData(null);
    setEffects([]);
  };

  const spawnEffect = (row: number, col: number, text: string, type: FloatingText['type']) => {
    const id = Date.now() + Math.random();
    setEffects(prev => [...prev, { id, row, col, text, type }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, 1000);
  };

  const handleAskAI = async () => {
    setAiMessage("水龙正在观察...");
    const hint = await getGameHint(grid, currentLevel.missionDescription, budget);
    setAiMessage(hint);
  };

  const getNeighbors = (r: number, c: number) => {
    return grid.filter(cell => 
        Math.abs(cell.row - r) <= 1 && 
        Math.abs(cell.col - c) <= 1 && 
        !(cell.row === r && cell.col === c)
    );
  };

  const checkPlacementValid = (tool: SimTool, cell: SimCell): { valid: boolean; reason?: string } => {
    if (tool.id === 'clean') return { valid: true }; // Can always try to clean

    // 1. Check Terrain
    const rules = PLACEMENT_RULES[tool.id as string];
    if (!rules) return { valid: true }; // Should not happen

    if (!rules.terrain.includes(cell.terrain)) {
        return { valid: false, reason: "地形不合适" };
    }

    // 2. Check Entity Occupancy
    if (cell.entity && cell.entity !== 'bug') { // Bug is special case for Frog
        return { valid: false, reason: "这里已经有东西了" };
    }
    if (cell.entity === 'snail') return { valid: false, reason: "被福寿螺占据了" };
    if (cell.entity === 'bug' && tool.id !== 'frog') return { valid: false, reason: "有蚊虫干扰" };

    // 3. Check Neighbors (simplified 8-grid check)
    if (rules.needs) {
        const neighbors = getNeighbors(cell.row, cell.col);
        const reqType = rules.needs.type;
        const count = neighbors.filter(n => {
            if (!n.entity) return false;
            if (reqType === 'plant') return ['grass', 'lotus'].includes(n.entity);
            if (reqType === 'fish') return ['carp'].includes(n.entity);
            return n.entity === reqType;
        }).length;

        if (count < rules.needs.count) {
            return { valid: false, reason: `缺少相邻的${reqType === 'plant' ? '植物' : reqType === 'fish' ? '鱼类' : reqType}` };
        }
    }

    return { valid: true };
  };

  const handleEntityClick = async (cell: SimCell) => {
    // If tool selected, try to apply tool
    if (selectedTool) {
        applyTool(cell);
        return;
    }

    // Animism Mode: Chat with entity
    if (cell.entity) {
        const text = await getEntityChat(SIM_TOOLS.find(t => t.id === cell.entity)?.name || cell.entity);
        setChatBubble({ cellId: `${cell.row}-${cell.col}`, text });
        setTimeout(() => setChatBubble(null), 3000);
    } else {
        setChatBubble({ cellId: `${cell.row}-${cell.col}`, text: "这里空荡荡的..." });
        setTimeout(() => setChatBubble(null), 1500);
    }
  };

  const updateCell = (cell: SimCell, newEntity: SimEntityType | null) => {
    const newGrid = grid.map(c => 
        (c.row === cell.row && c.col === cell.col) ? { ...c, entity: newEntity } : c
    );
    setGrid(newGrid);
  };

  const applyTool = (cell: SimCell) => {
    if (!selectedTool) return;

    // Logic for CLEAN tool
    if (selectedTool.id === 'clean') {
        if (cell.entity === 'trash') {
            if (budget < 20) { 
                setAiMessage("资金不足！"); 
                spawnEffect(cell.row, cell.col, "没钱啦", "info");
                return; 
            }
            updateCell(cell, null);
            setBudget(b => b - 20);
            setScore(s => s + 100);
            spawnEffect(cell.row, cell.col, "-20", "cost");
            setTimeout(() => spawnEffect(cell.row, cell.col, "+100分", "score"), 200);
            setAiMessage("垃圾清理成功！环境变好了！");
        } else if (cell.entity === 'snail') {
            if (budget < 10) { 
                setAiMessage("资金不足！"); 
                spawnEffect(cell.row, cell.col, "没钱啦", "info");
                return; 
            }
            updateCell(cell, null);
            setBudget(b => b - 10);
            setScore(s => s + 50);
            spawnEffect(cell.row, cell.col, "-10", "cost");
            setTimeout(() => spawnEffect(cell.row, cell.col, "+50分", "score"), 200);
            setAiMessage("福寿螺被铲除了！");
        } else if (cell.entity) {
             if (budget < 10) { 
                setAiMessage("资金不足！"); 
                spawnEffect(cell.row, cell.col, "没钱啦", "info");
                return; 
             }
             updateCell(cell, null);
             setBudget(b => b - 10);
             spawnEffect(cell.row, cell.col, "-10", "cost");
             setAiMessage("清理了该区域。");
        }
        return;
    }

    // Logic for PLACING items
    const validation = checkPlacementValid(selectedTool, cell);
    if (!validation.valid) {
        setAiMessage(`无法放置: ${validation.reason}`);
        spawnEffect(cell.row, cell.col, "❌", "info");
        return;
    }

    if (budget < selectedTool.cost) {
        setAiMessage("资金不足！");
        spawnEffect(cell.row, cell.col, "没钱啦", "info");
        return;
    }

    // Special case: Frog eats Bug
    if (selectedTool.id === 'frog' && cell.entity === 'bug') {
        updateCell(cell, 'frog');
        setBudget(b => b - selectedTool.cost + 100); // Bounty logic
        setScore(s => s + 150);
        spawnEffect(cell.row, cell.col, `-${selectedTool.cost}`, "cost");
        setTimeout(() => spawnEffect(cell.row, cell.col, "+100赏金", "earn"), 300);
        setTimeout(() => spawnEffect(cell.row, cell.col, "+150分", "score"), 600);
        setAiMessage("泽蛙吃掉了害虫！获得了环保赏金！");
    } else {
        updateCell(cell, selectedTool.id as SimEntityType);
        setBudget(b => b - selectedTool.cost);
        setScore(s => s + 50);
        spawnEffect(cell.row, cell.col, `-${selectedTool.cost}`, "cost");
        setTimeout(() => spawnEffect(cell.row, cell.col, "+50分", "score"), 300);
        setAiMessage(`成功种下了${selectedTool.name}`);
    }
  };

  // Effect to check win condition on grid change
  useEffect(() => {
    const checkWin = async () => {
        let complete = true;
        for (const target of currentLevel.missionTarget) {
            const count = grid.filter(c => c.entity === target.type).length;
            if (count < target.count) complete = false;
        }

        if (complete && !showNews && !isGeneratingNews) {
            onWin(); // Trigger global confetti
            setIsGeneratingNews(true);
            setShowNews(true); // Open modal immediately to show loading
            
            // Collect current entities for AI context
            const entityNames = grid
                .filter(c => c.entity)
                .map(c => SIM_TOOLS.find(t => t.id === c.entity)?.name || c.entity || "");
            
            const news = await getDailyNews(currentLevel.id, score, entityNames);
            setNewsData(news);
            setIsGeneratingNews(false);
        }
    };
    checkWin();
  }, [grid, currentLevel, score, showNews, isGeneratingNews, onWin]);


  const getTerrainColor = (t: TerrainType) => {
      switch(t) {
          case 'deep_water': return 'bg-blue-600';
          case 'shallow_water': return 'bg-blue-300';
          case 'land': return 'bg-amber-200';
          default: return 'bg-gray-200';
      }
  };

  const getEntityEmoji = (e: SimEntityType) => {
      const tool = SIM_TOOLS.find(t => t.id === e);
      if (tool) return tool.emoji;
      if (e === 'trash') return '🗑️';
      if (e === 'snail') return '🐌';
      if (e === 'bug') return '🦟';
      return '';
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Bar */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10 shrink-0">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={24} /></button>
        <div className="flex items-center gap-4 sm:gap-8">
             <div className="flex items-center gap-2 text-green-700 font-bold bg-green-100 px-4 py-2 rounded-full shadow-inner transition-transform" style={{ transform: budget < 100 ? 'scale(1.05)' : 'scale(1)' }}>
                 <Wallet size={20} className={budget < 50 ? 'text-red-500 animate-pulse' : 'text-green-700'} /> 
                 <span className={`text-lg ${budget < 50 ? 'text-red-600' : ''}`}>¥{budget}</span>
             </div>
             <div className="text-base sm:text-lg font-bold text-gray-500">
                 Level {currentLevel.id}
             </div>
        </div>
        <button onClick={() => startLevel(levelIndex)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><RotateCcw size={24} /></button>
      </div>

      {/* AI Assistant Bar */}
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-start gap-4 shrink-0 max-w-4xl mx-auto w-full">
         <div className="text-4xl pt-1">🐉</div>
         <div className="flex-1">
             <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm sm:text-base text-blue-900 leading-relaxed">
                 {aiMessage}
             </div>
             <div className="flex gap-2 mt-2">
                 <button onClick={handleAskAI} className="flex items-center gap-1 text-xs sm:text-sm bg-blue-200 text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-300 transition font-bold">
                     <Lightbulb size={14} /> 求助水龙
                 </button>
             </div>
         </div>
      </div>

      {/* Main Game Grid Container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center min-h-0 relative">
          <div className="w-full max-w-lg aspect-square relative">
            <div className="grid grid-cols-4 gap-1 sm:gap-2 bg-white p-2 shadow-xl rounded-xl border-4 border-gray-300 w-full h-full">
                {grid.map((cell) => {
                    const isValidHint = selectedTool && checkPlacementValid(selectedTool, cell).valid;
                    return (
                        <button
                            key={`${cell.row}-${cell.col}`}
                            onClick={() => handleEntityClick(cell)}
                            className={`
                                w-full h-full rounded-md sm:rounded-lg relative flex items-center justify-center text-3xl sm:text-5xl transition-all
                                ${getTerrainColor(cell.terrain)}
                                ${selectedTool && isValidHint ? 'ring-4 ring-green-400 ring-offset-2' : ''}
                                ${selectedTool && !isValidHint ? 'opacity-90' : ''}
                                active:scale-95
                            `}
                        >
                            {cell.entity && <span className="drop-shadow-md animate-float">{getEntityEmoji(cell.entity)}</span>}
                            
                            {/* Chat Bubble for Animism */}
                            {chatBubble?.cellId === `${cell.row}-${cell.col}` && (
                                <div className="absolute bottom-full mb-2 bg-white text-xs sm:text-sm px-2 py-1 rounded-lg shadow-xl whitespace-nowrap z-20 animate-bounce text-gray-800 border border-gray-100">
                                    {chatBubble.text}
                                </div>
                            )}
                            
                            {/* Terrain Indicator */}
                            <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] text-black/20 font-black uppercase pointer-events-none">
                                {cell.terrain === 'deep_water' ? 'Deep' : cell.terrain === 'shallow_water' ? 'Shallow' : 'Land'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Floating Text Overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {effects.map(effect => (
                  <div 
                    key={effect.id}
                    className="absolute font-bold text-shadow-md animate-float-text"
                    style={{
                      top: `${(effect.row * 25) + 10}%`,
                      left: `${(effect.col * 25) + 10}%`,
                      color: effect.type === 'cost' ? 'red' : effect.type === 'earn' ? '#F59E0B' : effect.type === 'score' ? '#10B981' : 'white',
                      fontSize: effect.type === 'score' ? '1.5rem' : '1.2rem',
                      zIndex: 30
                    }}
                  >
                    {effect.text}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 w-full max-w-lg shrink-0">
              <div className="flex gap-2 sm:gap-6 bg-white p-3 rounded-xl shadow-sm justify-center flex-wrap">
                  {currentLevel.missionTarget.map((t, idx) => {
                      const currentCount = grid.filter(c => c.entity === t.type).length;
                      return (
                          <div key={idx} className={`flex items-center gap-2 px-3 py-1 rounded-lg ${currentCount >= t.count ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 border border-gray-200 text-gray-800'}`}>
                              <span className="text-2xl">{getEntityEmoji(t.type)}</span>
                              <div className="flex flex-col leading-none">
                                  <span className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Target</span>
                                  <span className="text-sm font-black">{currentCount}/{t.count}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* Tools Dock */}
      <div className="bg-white border-t border-gray-200 p-2 sm:p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
         <div className="flex justify-center">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 px-2 max-w-full no-scrollbar">
                {SIM_TOOLS.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(selectedTool?.id === tool.id ? null : tool)}
                        disabled={budget < tool.cost && tool.id !== 'clean'}
                        className={`
                            flex flex-col items-center p-2 rounded-xl border-2 w-16 sm:w-20 transition-all shrink-0
                            ${selectedTool?.id === tool.id ? 'border-blue-500 bg-blue-50 -translate-y-2 shadow-lg' : 'border-transparent hover:bg-gray-50'}
                            ${(budget < tool.cost && tool.id !== 'clean') ? 'opacity-40 grayscale' : ''}
                        `}
                    >
                        <div className="text-2xl sm:text-3xl mb-1">{tool.emoji}</div>
                        <span className="text-xs font-bold text-gray-600 text-center leading-tight w-full truncate">{tool.name}</span>
                        <span className="text-xs font-black text-green-600">¥{tool.cost}</span>
                    </button>
                ))}
            </div>
         </div>
         {selectedTool && (
             <div className="text-center text-xs sm:text-sm text-gray-500 mt-2 font-medium">
                 {selectedTool.description}
             </div>
         )}
      </div>

      <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes float-text {
            0% { transform: translateY(0) scale(0.8); opacity: 0; }
            20% { transform: translateY(-10px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-40px) scale(1); opacity: 0; }
          }
          .animate-float-text {
            animation: float-text 1s ease-out forwards;
            text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
          }
      `}</style>

      {/* Daily News Modal */}
      {showNews && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#fcfae1] p-0 rounded-sm shadow-2xl max-w-md w-full rotate-1 animate-float relative overflow-hidden">
                  {/* Paper Texture Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

                  <div className="p-6 sm:p-8 flex flex-col h-full relative z-10">
                      
                      {/* Newspaper Header */}
                      <div className="border-b-4 border-black mb-4 pb-2 flex justify-between items-end">
                          <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">XIONGFAN VILLAGE</div>
                            <h2 className="text-3xl sm:text-4xl font-black font-serif text-gray-900 tracking-tighter leading-none">湿地日报</h2>
                          </div>
                          <div className="text-right">
                              <div className="text-xs font-bold text-gray-600">{new Date().toLocaleDateString()}</div>
                              <div className="text-xs text-gray-400 font-serif italic">第 {currentLevel.id} 期</div>
                          </div>
                      </div>

                      {/* Content Area */}
                      {isGeneratingNews ? (
                          <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-4">
                              <Newspaper className="animate-pulse w-12 h-12" />
                              <p className="font-serif italic animate-pulse">正在疯狂赶稿中...</p>
                          </div>
                      ) : (
                          <div className="flex-1 flex flex-col gap-4">
                              {/* Headline */}
                              <h3 className="text-2xl font-bold text-blue-900 leading-tight font-serif text-center border-b-2 border-gray-200 pb-4">
                                  {newsData?.headline}
                              </h3>

                              {/* Photo Placeholder */}
                              <div className="bg-gray-200 w-full aspect-video rounded-sm border-2 border-gray-400 flex flex-col items-center justify-center text-gray-500 gap-2 relative overflow-hidden group">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                                  <Camera size={32} className="relative z-10" />
                                  <span className="text-xs font-bold relative z-10">生态修复现场</span>
                              </div>

                              {/* Body Text */}
                              <div className="text-sm sm:text-base text-gray-800 font-serif leading-relaxed text-justify">
                                  <span className="font-bold text-2xl float-left mr-2 mt-[-4px]">“</span>
                                  {newsData?.body}
                              </div>

                              {/* Interview Box */}
                              <div className="bg-white border-2 border-dashed border-gray-400 p-3 rounded-lg flex gap-3 items-start transform -rotate-1 shadow-sm mt-2">
                                  <div className="bg-yellow-200 p-2 rounded-full shrink-0">
                                      <MessageCircle size={20} className="text-yellow-800" />
                                  </div>
                                  <div>
                                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">今日之星访谈</div>
                                      <p className="text-sm font-bold text-gray-800 italic">
                                          {newsData?.interview}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* Footer Actions */}
                      <button 
                        disabled={isGeneratingNews}
                        onClick={() => {
                            if (levelIndex < SIM_LEVELS.length - 1) {
                                setLevelIndex(prev => prev + 1);
                            } else {
                                onBack(); // Finish
                            }
                        }}
                        className="w-full bg-black text-white py-3 sm:py-4 text-lg font-bold mt-6 hover:bg-gray-800 transition uppercase tracking-widest shadow-lg disabled:opacity-50"
                      >
                          {isGeneratingNews ? '稍等...' : (levelIndex < SIM_LEVELS.length - 1 ? '前往下一关' : '返回中心')}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default EcoSimGame;
