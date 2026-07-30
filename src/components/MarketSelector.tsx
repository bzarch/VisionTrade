import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Asset, AssetCategory } from '../types';
import { TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';

export const MarketSelector: React.FC = () => {
  const { assets, activeAsset, setActiveAsset, searchQuery } = useMarketStore();
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>('all');

  const filteredAssets = assets.filter(a => {
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch = a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 flex flex-col gap-3 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Daftar Aset Pasar Real-Time</h3>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
            {filteredAssets.length} Aset Live
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'crypto', 'global_stocks', 'idx_stocks', 'forex'] as const).map((cat) => {
            const count = cat === 'all' ? assets.length : assets.filter(a => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white bg-white/[0.02]'
                }`}
              >
                {cat === 'all' && `🌐 Semua (${count})`}
                {cat === 'crypto' && `🪙 Kripto (${count})`}
                {cat === 'global_stocks' && `🇺🇸 Saham US (${count})`}
                {cat === 'idx_stocks' && `🇮🇩 Saham IDX (${count})`}
                {cat === 'forex' && `💱 Forex & Komoditas (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filteredAssets.map((asset, index) => {
          const isSelected = activeAsset?.id === asset.id || activeAsset?.symbol === asset.symbol;
          const isPositive = asset.change24h >= 0;

          return (
            <button
              key={`${asset.id}-${index}`}
              onClick={() => setActiveAsset(asset)}
              className={`flex-shrink-0 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-white/[0.08] border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">{asset.symbol}</span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{asset.currency}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[100px]">{asset.name}</div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-slate-200">
                  {asset.currency === 'IDR'
                    ? `Rp ${asset.price.toLocaleString()}`
                    : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </div>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{isPositive ? '+' : ''}{asset.change24h}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
