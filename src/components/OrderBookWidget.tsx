import React from 'react';
import { useMarketStore } from '../store/marketStore';

export const OrderBookWidget: React.FC = () => {
  const { activeAsset } = useMarketStore();
  const price = activeAsset?.price || 94850.50;

  // Generate synthetic realistic order book around current price
  const bids = Array.from({ length: 5 }).map((_, i) => {
    const p = price * (1 - (i + 1) * 0.0008);
    const amount = Number((Math.sin(i * 3 + 1) * 1.5 + 2.2).toFixed(3));
    const total = Number((p * amount).toFixed(2));
    const depthPct = Math.min(100, Math.round((amount / 4) * 100));
    return { price: Number(p.toFixed(2)), amount, total, depthPct };
  });

  const asks = Array.from({ length: 5 }).map((_, i) => {
    const p = price * (1 + (i + 1) * 0.0008);
    const amount = Number((Math.cos(i * 2 + 1) * 1.5 + 2.0).toFixed(3));
    const total = Number((p * amount).toFixed(2));
    const depthPct = Math.min(100, Math.round((amount / 4) * 100));
    return { price: Number(p.toFixed(2)), amount, total, depthPct };
  }).reverse();

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-5 shadow-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">Order Book Live</h3>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          Spread: 0.01%
        </span>
      </div>

      <div className="my-3 space-y-1 font-mono text-[11px]">
        {/* Table Header */}
        <div className="grid grid-cols-3 text-slate-500 text-[10px] uppercase font-semibold pb-1 border-b border-white/5">
          <span>Price ({activeAsset?.currency || 'USD'})</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sells - Red) */}
        <div className="space-y-0.5">
          {asks.map((ask, idx) => (
            <div key={idx} className="relative grid grid-cols-3 py-0.5 text-slate-300 items-center overflow-hidden">
              <div
                className="absolute right-0 top-0 bottom-0 bg-rose-500/10 transition-all duration-300"
                style={{ width: `${ask.depthPct}%` }}
              />
              <span className="text-rose-400 font-bold relative z-10">{ask.price}</span>
              <span className="text-right relative z-10">{ask.amount}</span>
              <span className="text-right text-slate-400 relative z-10">{ask.total.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Current Mid Price */}
        <div className="py-2 border-y border-white/10 my-1 text-center font-bold text-sm text-cyan-400 bg-cyan-500/5 rounded-lg">
          {activeAsset?.currency === 'IDR' ? `Rp ${price.toLocaleString()}` : `$${price.toLocaleString()}`}
        </div>

        {/* Bids (Buys - Green) */}
        <div className="space-y-0.5">
          {bids.map((bid, idx) => (
            <div key={idx} className="relative grid grid-cols-3 py-0.5 text-slate-300 items-center overflow-hidden">
              <div
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-300"
                style={{ width: `${bid.depthPct}%` }}
              />
              <span className="text-emerald-400 font-bold relative z-10">{bid.price}</span>
              <span className="text-right relative z-10">{bid.amount}</span>
              <span className="text-right text-slate-400 relative z-10">{bid.total.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
