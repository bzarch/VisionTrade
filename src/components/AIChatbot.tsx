import React, { useState, useRef, useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { MessageSquare, X, Send, Sparkles, Bot, User, Minimize2 } from 'lucide-react';

export const AIChatbot: React.FC = () => {
  const { chatMessages, sendChatMessage, activeAsset, isAiLoading } = useMarketStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendChatMessage(input);
      setInput('');
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 p-[1px] rounded-full shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <div className="bg-slate-950 px-4 py-3 rounded-full flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">Tanya Gemini 3.6 AI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900/90 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Glass Header */}
          <div className="px-5 py-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  VisionTrade AI Specialist
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Gemini 3.6 Flash • {activeAsset?.symbol || 'Crypto'} Focus
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleQuickPrompt(`Bagaimana outlook teknikal ${activeAsset?.symbol} saat ini?`)}
              className="px-2.5 py-1 rounded-xl text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 whitespace-nowrap"
            >
              📊 Outlook Teknikal
            </button>
            <button
              onClick={() => handleQuickPrompt(`Mana level Support & Resistance penting untuk ${activeAsset?.symbol}?`)}
              className="px-2.5 py-1 rounded-xl text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 whitespace-nowrap"
            >
              🎯 Support & Resistance
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 border leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-slate-100 rounded-br-xs'
                      : 'bg-white/[0.04] border-white/10 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] text-slate-500 font-mono block text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-cyan-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white/[0.03] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Tanyakan strategi trading ${activeAsset?.symbol}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              disabled={isAiLoading || !input.trim()}
              className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold disabled:opacity-50 hover:opacity-90 transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
