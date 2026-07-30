import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { DataSource } from '../types';
import { Database, CheckCircle2 } from 'lucide-react';

export const SourceSelector: React.FC = () => {
  const { activeSource, setSource } = useMarketStore();

  const sources: Array<{ id: DataSource; label: string; desc: string; freeTag: string }> = [
    { id: 'binance', label: 'Binance Public', desc: '100+ Crypto Assets REST/WS', freeTag: '100% Free Public' },
    { id: 'coingecko', label: 'CoinGecko API', desc: 'Crypto OHLC & Market Cap', freeTag: '50 req/min' },
    { id: 'yahoo', label: 'Yahoo Finance', desc: 'Global US Stocks & FX Tickers', freeTag: 'No Key Req' },
    { id: 'idx', label: 'Saham IDX', desc: 'Indonesia Stocks (BBCA, TLKM)', freeTag: '958 Stocks' },
    { id: 'exchangerate', label: 'Rates API', desc: 'ECB Forex Rates 160+ Pairs', freeTag: 'Open Access' },
    { id: 'worldbank', label: 'World Bank', desc: 'Global Economic Macro Data', freeTag: 'Public API' },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">Data Source Selector</h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
          Zero API Key Required
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {sources.map((s) => {
          const isActive = activeSource === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{s.label}</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{s.desc}</p>
              <span className="text-[9px] font-mono text-cyan-300 mt-2 inline-block">
                {s.freeTag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
