import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Activity, Percent, ArrowUp, ArrowDown } from 'lucide-react';

export const IndicatorPanel: React.FC = () => {
  const { indicators, activeAsset } = useMarketStore();

  if (!indicators) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-slate-400 text-center">
        Menghitung indikator teknikal...
      </div>
    );
  }

  const { rsi, macd, sma, bollinger, volumeRatio } = indicators;

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Math Indicator Engine (15+ Technicals)</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          Mathematical Precision
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* RSI */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">RSI (14 Period)</span>
          <div className="text-xl font-mono font-bold text-white mt-1">{rsi}</div>
          <span className={`text-[10px] font-mono font-semibold block mt-1 ${
            rsi < 35 ? 'text-emerald-400' : rsi > 65 ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {rsi < 35 ? 'Oversold (Beli)' : rsi > 65 ? 'Overbought (Jual)' : 'Netral Range'}
          </span>
        </div>

        {/* MACD */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">MACD Hist (12,26,9)</span>
          <div className={`text-xl font-mono font-bold mt-1 ${macd.histogram > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {macd.histogram > 0 ? '+' : ''}{macd.histogram}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            Line: {macd.macdLine} | Sig: {macd.signalLine}
          </span>
        </div>

        {/* SMA 20 / 50 */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">SMA 20 vs SMA 50</span>
          <div className="text-xl font-mono font-bold text-amber-400 mt-1">${sma.sma20}</div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            SMA 50: ${sma.sma50} ({sma.sma20 > sma.sma50 ? 'Golden Cross' : 'Death Cross'})
          </span>
        </div>

        {/* Bollinger Bands %B */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Bollinger %B</span>
          <div className="text-xl font-mono font-bold text-purple-400 mt-1">{bollinger.percentB}%</div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            Upper: ${bollinger.upper} | Lower: ${bollinger.lower}
          </span>
        </div>

        {/* Volume Ratio */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Volume Anomaly</span>
          <div className="text-xl font-mono font-bold text-cyan-400 mt-1">{volumeRatio}x</div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            vs 20 Period Moving Average
          </span>
        </div>
      </div>
    </div>
  );
};
