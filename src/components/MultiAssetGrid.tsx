import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { TrendingUp, TrendingDown, Layers, ArrowUpRight } from 'lucide-react';

export const MultiAssetGrid: React.FC = () => {
  const { assets, setActiveAsset, setActiveTab } = useMarketStore();

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Multi-Asset Watchlist & Sparklines</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          {assets.length} Active Feeds
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset, index) => {
          const isPositive = asset.change24h >= 0;

          return (
            <div
              key={`${asset.id}-${index}`}
              onClick={() => {
                setActiveAsset(asset);
                setActiveTab('overview');
              }}
              className="group bg-white/[0.03] border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-cyan-500/50 hover:bg-white/[0.06] transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md uppercase">
                      {asset.category}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{asset.name}</p>
              </div>

              {/* Price & Change */}
              <div className="my-4 flex items-baseline justify-between">
                <div className="text-xl font-mono font-extrabold text-white">
                  {asset.currency === 'IDR'
                    ? `Rp ${asset.price.toLocaleString()}`
                    : `$${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{isPositive ? '+' : ''}{asset.change24h}%</span>
                </div>
              </div>

              {/* Visual Sparkline Preview */}
              <div className="h-8 flex items-end gap-1 pt-2 border-t border-white/5">
                {asset.sparkline?.map((val, idx) => {
                  const min = Math.min(...asset.sparkline);
                  const max = Math.max(...asset.sparkline);
                  const heightPct = Math.max(15, Math.min(100, ((val - min) / (max - min || 1)) * 100));

                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-sm transition-all ${isPositive ? 'bg-emerald-500/60' : 'bg-rose-500/60'}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
