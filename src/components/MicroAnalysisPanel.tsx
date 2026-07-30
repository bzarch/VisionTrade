import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Building2, PieChart, BarChart3, ArrowUpRight, DollarSign, Activity, Percent, Scale, ShieldCheck, Zap } from 'lucide-react';

export const MicroAnalysisPanel: React.FC = () => {
  const { activeAsset } = useMarketStore();

  if (!activeAsset) return null;

  const micro = activeAsset.micro || {
    marketCap: activeAsset.currency === 'IDR' ? 'Rp 250 T' : '$250B',
    peRatio: activeAsset.category === 'idx_stocks' ? 18.5 : activeAsset.category === 'global_stocks' ? 28.4 : 0,
    pbvRatio: activeAsset.category === 'idx_stocks' ? 2.4 : activeAsset.category === 'global_stocks' ? 8.2 : 0,
    roe: activeAsset.category === 'idx_stocks' ? 18.2 : activeAsset.category === 'global_stocks' ? 24.5 : 0,
    dividendYield: activeAsset.category === 'idx_stocks' ? 4.2 : 0.8,
    netProfitMargin: 21.5,
    earningsGrowth: activeAsset.change24h > 0 ? 12.8 : -2.4,
    bidAskSpread: 0.02,
    orderBookPressure: activeAsset.change24h > 0.5 ? 'BUY_DOMINANT' : activeAsset.change24h < -0.5 ? 'SELL_DOMINANT' : 'NEUTRAL',
    liquidityScore: 94,
    microTrendSignal: activeAsset.change24h > 2.0 ? 'BREAKOUT' : activeAsset.change24h > 0 ? 'ACCUMULATION' : 'DISTRIBUTION'
  };

  const isStock = activeAsset.category === 'idx_stocks' || activeAsset.category === 'global_stocks';

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Analisis Mikro & Fondamental Perusahaan
              <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                {activeAsset.symbol}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Metrik mikro internal, kesehatan neraca keuangan, valuasi rasio, dan struktur likuiditas
            </p>
          </div>
        </div>

        {/* Micro Trend Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Sinyal Aliran Mikro</div>
            <div className="text-xs font-bold text-amber-300">
              {micro.microTrendSignal === 'BREAKOUT' && '🔥 BREAKOUT MOMENTUM'}
              {micro.microTrendSignal === 'ACCUMULATION' && '🟢 AKUMULASI INSTITUSIONAL'}
              {micro.microTrendSignal === 'DISTRIBUTION' && '🔴 DISTRIBUSI / SELLING'}
              {micro.microTrendSignal === 'CONSOLIDATION' && '🟡 KONSOLIDASI RANGE'}
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Financial & Micro Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Market Cap */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-cyan-400" />
            <span>Market Cap</span>
          </div>
          <div className="text-base font-extrabold font-mono text-white">{micro.marketCap}</div>
          <div className="text-[10px] text-slate-500">Kapitalisasi Pasar</div>
        </div>

        {/* P/E Ratio */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Scale className="w-3 h-3 text-purple-400" />
            <span>P/E Ratio (PER)</span>
          </div>
          <div className="text-base font-extrabold font-mono text-purple-300">
            {micro.peRatio > 0 ? `${micro.peRatio}x` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Valuasi Harga/Laba</div>
        </div>

        {/* P/BV Ratio */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <PieChart className="w-3 h-3 text-indigo-400" />
            <span>P/BV Ratio</span>
          </div>
          <div className="text-base font-extrabold font-mono text-indigo-300">
            {micro.pbvRatio > 0 ? `${micro.pbvRatio}x` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Harga terhadap Nilai Buku</div>
        </div>

        {/* ROE */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <Percent className="w-3 h-3 text-emerald-400" />
            <span>Return on Equity</span>
          </div>
          <div className="text-base font-extrabold font-mono text-emerald-400">
            {micro.roe > 0 ? `${micro.roe}%` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Efisiensi Ekuitas</div>
        </div>

        {/* Net Profit Margin */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-emerald-400" />
            <span>Profit Margin</span>
          </div>
          <div className="text-base font-extrabold font-mono text-emerald-300">
            {micro.netProfitMargin > 0 ? `${micro.netProfitMargin}%` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500">Margin Bersih</div>
        </div>

        {/* Dividend Yield */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-amber-400" />
            <span>Dividend Yield</span>
          </div>
          <div className="text-base font-extrabold font-mono text-amber-300">
            {micro.dividendYield > 0 ? `${micro.dividendYield}%` : '0%'}
          </div>
          <div className="text-[10px] text-slate-500">Hasil Dividen Tahunan</div>
        </div>

      </div>

      {/* Micro-Structure & Orderbook Depth Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Spread Bid-Ask</div>
            <div className="text-sm font-bold font-mono text-white">{micro.bidAskSpread}%</div>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg border border-emerald-500/30">
            TIGHT SPREAD (HIGH LIQUIDITY)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Orderbook Pressure</div>
            <div className={`text-sm font-bold font-mono ${micro.orderBookPressure === 'BUY_DOMINANT' ? 'text-emerald-400' : micro.orderBookPressure === 'SELL_DOMINANT' ? 'text-rose-400' : 'text-slate-300'}`}>
              {micro.orderBookPressure === 'BUY_DOMINANT' ? '🟢 BUYERS DOMINANT (+68%)' : micro.orderBookPressure === 'SELL_DOMINANT' ? '🔴 SELLERS DOMINANT (+62%)' : '⚪ BALANCED'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Liquidity Score</div>
            <div className="text-sm font-bold font-mono text-cyan-400">{micro.liquidityScore} / 100</div>
          </div>
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>

      </div>

    </div>
  );
};
