
import React from 'react';
import { X, Volume2, Music, Trash2, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  onResetProgress: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  musicEnabled,
  onMusicToggle,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-float">
        <div className="bg-green-500 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RotateCcw size={24} /> 设置
          </h2>
          <button onClick={onClose} className="hover:bg-green-600 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Volume Control */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-700 font-bold text-lg">
              <Volume2 className="text-green-600" /> 音量
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="text-right text-sm text-gray-500">{Math.round(volume * 100)}%</div>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700 font-bold text-lg">
              <Music className="text-blue-500" /> 环境音效
            </label>
            <button
              onClick={onMusicToggle}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                musicEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Reset Progress */}
          <div>
            <h3 className="text-gray-700 font-bold text-lg mb-2 flex items-center gap-2">
                <Trash2 className="text-red-500" /> 危险区域
            </h3>
            <button
              onClick={() => {
                if (window.confirm("确定要清空所有的动物收集进度吗？")) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border-2 border-red-100 hover:bg-red-100 transition flex justify-center items-center gap-2"
            >
              重置游戏进度
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
