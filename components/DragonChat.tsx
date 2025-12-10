import React, { useState, useRef, useEffect } from 'react';
import { generateDragonResponse } from '../services/geminiService';
import { Message } from '../types';
import { Send, ArrowLeft } from 'lucide-react';

interface DragonChatProps {
  onClose: () => void;
}

const DragonChat: React.FC<DragonChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '你好呀！我是水龙。关于熊畈村湿地，你想知道什么呢？🐉' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await generateDragonResponse(input);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'model', text: replyText }]);
  };

  return (
    <div className="flex flex-col h-full bg-blue-50">
      {/* Header */}
      <div className="bg-blue-500 p-4 text-white flex items-center shadow-md">
        <button onClick={onClose} className="mr-3 hover:bg-blue-600 p-1 rounded">
          <ArrowLeft />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">水龙小百科</h2>
          <p className="text-xs text-blue-100">随时为你解答湿地问题</p>
        </div>
        <div className="text-3xl">🐉</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
              <span className="animate-pulse">✨ 正在思考...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问问水龙..."
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`ml-2 p-2 rounded-full ${
              input.trim() ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-300 text-gray-500'
            } transition`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragonChat;