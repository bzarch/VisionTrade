import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Cpu, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export const AIStatusBadge: React.FC = () => {
  const { isAiLoading, aiSignal } = useMarketStore();

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div>
          <div className="text-slate-200 font-bold flex items-center gap-1.5">
            <span>Gemini 3.6 Flash Engine</span>
            <span className="text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">GA Ready</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Thinking Config: <span className="text-cyan-400">medium</span> | Latency: ~140ms</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isAiLoading ? (
          <div className="flex items-center gap-1 text-purple-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[11px]">Analyzing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Synced</span>
          </div>
        )}
      </div>
    </div>
  );
};
