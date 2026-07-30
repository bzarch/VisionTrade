import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Target, ShieldAlert, CheckCircle, HelpCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const ConfidenceGauge: React.FC = () => {
  const { confluence, aiSignal, activeAsset } = useMarketStore();

  const score = aiSignal ? aiSignal.confidenceScore : (confluence ? confluence.score : 50);
  const signal = aiSignal ? aiSignal.finalSignal : (confluence ? confluence.signal : 'HOLD');

  const getSignalColor = (sig: string) => {
    switch (sig) {
      case 'BUY':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20';
      case 'SELL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-rose-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-amber-500/20';
    }
  };

  const getSignalIcon = (sig: string) => {
    switch (sig) {
      case 'BUY':
        return <ArrowUpRight className="w-5 h-5 text-emerald-400" />;
      case 'SELL':
        return <ArrowDownRight className="w-5 h-5 text-rose-400" />;
      default:
        return <Minus className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col justify-between">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">AI Confluence Signal</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase">
          Matematik + Gemini 3.6
        </span>
      </div>

      {/* Main Signal Badge & Confidence Meter */}
      <div className="my-6 flex flex-col items-center justify-center text-center">
        {/* Semi-circular visual dial progress */}
        <div className="relative w-44 h-24 flex flex-col items-center justify-end overflow-hidden mb-3">
          <div className="w-40 h-40 rounded-full border-[12px] border-white/5 border-t-cyan-500 border-r-indigo-500 transition-all duration-700" style={{ transform: `rotate(${(score / 100) * 180 - 90}deg)` }} />
          <div className="absolute bottom-0 text-center">
            <span className="text-3xl font-mono font-black text-white">{score}</span>
            <span className="text-[10px] text-slate-400 font-mono block">/ 100 Confidence</span>
          </div>
        </div>

        {/* Signal Tag */}
        <div className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl border text-xl font-black font-mono shadow-xl ${getSignalColor(signal)}`}>
          {getSignalIcon(signal)}
          <span>{signal} SIGNAL</span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      {confluence && (
        <div className="space-y-2 mt-2 pt-4 border-t border-white/10">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Faktor Konfluensi Matematika:</h4>
          {confluence.reasons.slice(0, 3).map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
