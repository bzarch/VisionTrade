import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { PieChart, Trash2, TrendingUp, TrendingDown, DollarSign, Award, ShieldCheck } from 'lucide-react';

export const PortfolioTracker: React.FC = () => {
  const { portfolio, closePortfolioTrade } = useMarketStore();

  const totalValue = portfolio.reduce((acc, p) => acc + (p.currentPrice * p.amount), 0);
  const totalPnL = portfolio.reduce((acc, p) => acc + p.pnl, 0);
  const winCount = portfolio.filter(p => p.pnl >= 0).length;
  const winRate = portfolio.length > 0 ? Math.round((winCount / portfolio.length) * 100) : 100;

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Simulasi Portfolio & Risk Manager</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
          Paper Trading Active
        </span>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Total Estimasi Portfolio</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-1">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Unrealized P&L</span>
          <div className={`text-2xl font-mono font-extrabold mt-1 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Win Rate Simulasi</span>
          <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-1">
            {winRate}%
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Sharpe Ratio Estimate</span>
          <div className="text-2xl font-mono font-extrabold text-purple-400 mt-1">
            2.45 (Optimal)
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
              <th className="pb-2">Aset / Posisi</th>
              <th className="pb-2 text-right">Harga Entry</th>
              <th className="pb-2 text-right">Harga Sekarang</th>
              <th className="pb-2 text-right">Jumlah Unit</th>
              <th className="pb-2 text-right">Unrealized PnL</th>
              <th className="pb-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {portfolio.map((pos) => {
              const isProfit = pos.pnl >= 0;
              return (
                <tr key={pos.id} className="hover:bg-white/[0.02]">
                  <td className="py-3">
                    <div className="font-bold text-white">{pos.symbol}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{pos.type} • {pos.timestamp}</div>
                  </td>
                  <td className="py-3 text-right text-slate-300">${pos.entryPrice.toLocaleString()}</td>
                  <td className="py-3 text-right text-slate-300">${pos.currentPrice.toLocaleString()}</td>
                  <td className="py-3 text-right text-slate-300">{pos.amount}</td>
                  <td className={`py-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}${pos.pnl.toLocaleString()} ({isProfit ? '+' : ''}{pos.pnlPercent}%)
                  </td>
                  <td className="py-3 text-center">
                    <button
                      onClick={() => closePortfolioTrade(pos.id)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      title="Tutup Posisi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
