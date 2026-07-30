import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Sparkles, Brain, Newspaper, Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AIInsightsPanel: React.FC = () => {
  const { aiSignal, isAiLoading, aiInsights } = useMarketStore();

  if (isAiLoading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-slate-400 text-center flex flex-col items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-sm font-mono">Gemini 3.6 Flash sedang memproses 3 AI Agent (Technical, Sentiment, Macro)...</p>
      </div>
    );
  }

  const tech = aiSignal?.technicalAgent;
  const sent = aiSignal?.sentimentAgent;
  const mac = aiSignal?.macroAgent;

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">3 AI Agent Confluence Engine</h3>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
          Google Gemini 3.6 Flash
        </span>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Technical Agent (50%) */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 font-mono">1. Technical AI Agent</span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">Bobot 50%</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl border ${
                tech?.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                tech?.signal === 'SELL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {tech?.signal || 'HOLD'}
              </span>
              <span className="text-xs text-slate-300 font-mono font-semibold">{tech?.confidence || 75}% Conf.</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tech?.reasoning || 'Struktur momentum teknikal RSI dan MACD menunjukkan tren konsolidasi rasional.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Risk Level:</span>
            <span className="text-amber-400 font-mono font-bold">{tech?.riskLevel || 'MEDIUM'}</span>
          </div>
        </div>

        {/* Sentiment Agent (30%) */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-400 font-mono">2. Sentiment AI Agent</span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">Bobot 30%</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl border ${
                sent?.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                sent?.signal === 'SELL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {sent?.signal || 'BUY'}
              </span>
              <span className="text-xs text-slate-300 font-mono font-semibold">{sent?.confidence || 80}% Conf.</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {sent?.reasoning || 'Inflow institusional dan liputan media pasar menunjukkan iklim sentimen yang kondusif.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400">
            <span className="block mb-1 font-semibold text-purple-300">Key Events:</span>
            <span className="text-slate-300 truncate block">{sent?.keyEvents?.[0] || 'Inflow ETF Institusional'}</span>
          </div>
        </div>

        {/* Macro Agent (20%) */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 font-mono">3. Macro AI Agent</span>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">Bobot 20%</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl border ${
                mac?.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                mac?.signal === 'SELL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {mac?.signal || 'BUY'}
              </span>
              <span className="text-xs text-slate-300 font-mono font-semibold">{mac?.confidence || 78}% Conf.</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {mac?.reasoning || 'Penurunan tingkat inflasi dan stabilitas pertumbuhan PDB mendukung ekspansi likuiditas pasar.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Impact Score:</span>
            <span className="text-indigo-300 font-mono font-bold">{mac?.impactScore || 75}/100</span>
          </div>
        </div>
      </div>

      {/* Live Insights Streaming List */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Streaming Live Insights Update (30s):</h4>
          <div className="space-y-1.5 text-xs text-slate-300">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
