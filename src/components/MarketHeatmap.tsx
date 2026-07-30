import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Grid, Activity, TrendingUp, TrendingDown, Layers, BarChart } from 'lucide-react';

export const MarketHeatmap: React.FC = () => {
  const { assets, setActiveAsset, setActiveTab, activeAsset } = useMarketStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'crypto' | 'global_stocks' | 'idx_stocks' | 'forex'>('all');

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter(a => a.category === selectedCategory);

  // Benchmarks for Correlation Matrix
  const benchmarks = [
    { name: 'S&P 500 (US)', corr: +0.78, type: 'High Positive' },
    { name: 'IHSG Composite (ID)', corr: +0.62, type: 'Moderate Positive' },
    { name: 'NASDAQ 100', corr: +0.84, type: 'High Positive' },
    { name: 'Gold (XAU/USD)', corr: -0.42, type: 'Inverse/Hedge' },
    { name: 'DXY USD Index', corr: -0.68, type: 'Negative Correlation' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Market Heatmap & Correlation Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Peta performa visual real-time lintas pasar global & matriks korelasi antar-aset
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          {(['all', 'crypto', 'global_stocks', 'idx_stocks', 'forex'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' && '🌐 Semua'}
              {cat === 'crypto' && '🪙 Crypto'}
              {cat === 'global_stocks' && '🇺🇸 Saham US'}
              {cat === 'idx_stocks' && '🇮🇩 Saham IDX'}
              {cat === 'forex' && '💱 Forex'}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredAssets.map((asset) => {
          const change = asset.change24h;
          const isPositive = change >= 0;

          // Color scale
          let bgClass = 'bg-slate-800/40 border-slate-700/40';
          if (change >= 4.0) bgClass = 'bg-emerald-600/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10';
          else if (change > 0) bgClass = 'bg-emerald-500/15 border-emerald-500/30';
          else if (change <= -4.0) bgClass = 'bg-rose-600/30 border-rose-500/50 shadow-lg shadow-rose-500/10';
          else if (change < 0) bgClass = 'bg-rose-500/15 border-rose-500/30';

          return (
            <div
              key={asset.id}
              onClick={() => {
                setActiveAsset(asset);
                setActiveTab('overview');
              }}
              className={`p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[110px] ${bgClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white tracking-tight">{asset.symbol}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{asset.category.split('_')[0]}</span>
              </div>

              <div>
                <div className="text-xs text-slate-300 font-mono font-medium truncate mb-1">
                  {asset.currency === 'IDR' ? `Rp ${asset.price.toLocaleString('id-ID')}` : `$${asset.price.toLocaleString()}`}
                </div>
                <div className={`text-sm font-extrabold font-mono flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPositive ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Correlation Matrix Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Matriks Korelasi
              <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                {activeAsset?.symbol || 'BTC/USDT'} vs Indeks Global
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Ukur sensitivitas pergerakan {activeAsset?.symbol || 'aset'} terhadap indeks dan instrumen acuan utama dunia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {benchmarks.map((b) => (
            <div key={b.name} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div className="text-xs font-bold text-slate-300 mb-2">{b.name}</div>
              <div>
                <div className="text-lg font-extrabold font-mono text-cyan-400">
                  {b.corr > 0 ? `+${b.corr}` : b.corr}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
