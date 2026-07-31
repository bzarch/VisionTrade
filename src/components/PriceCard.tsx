import React, { useState, useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { TrendingUp, TrendingDown, Zap, Bell, ShieldCheck, RefreshCw } from 'lucide-react';

export const PriceCard: React.FC = () => {
  const { activeAsset, fetchMarketData, addPortfolioTrade, addPriceAlert, isDataLoading } = useMarketStore();
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('0.1');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertPriceInput, setAlertPriceInput] = useState('');

  useEffect(() => {
    if (activeAsset) {
      if (prevPrice !== null && prevPrice !== activeAsset.price) {
        if (activeAsset.price > prevPrice) {
          setFlash('up');
        } else {
          setFlash('down');
        }
        const timer = setTimeout(() => setFlash(null), 1000);
        return () => clearTimeout(timer);
      }
      setPrevPrice(activeAsset.price);
    }
  }, [activeAsset?.price]);

  if (!activeAsset) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 text-center text-slate-400">
        Memuat data ticker...
      </div>
    );
  }

  const isPositive = activeAsset.change24h >= 0;

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const amt = parseFloat(tradeAmount);
    if (amt > 0) {
      addPortfolioTrade(type, amt);
      setTradeModalOpen(false);
    }
  };

  const handleSetAlert = () => {
    const p = parseFloat(alertPriceInput);
    if (p > 0) {
      const condition = p > activeAsset.price ? 'ABOVE' : 'BELOW';
      addPriceAlert(p, condition);
      setAlertModalOpen(false);
    }
  };

  return (
    <div className="relative bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 transform hover:-translate-y-0.5">
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-700 pointer-events-none ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-inner">
            {activeAsset.symbol.substring(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">{activeAsset.symbol}</h2>
              <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase">
                {activeAsset.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{activeAsset.name}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchMarketData()}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => {
              setAlertPriceInput(activeAsset.price.toString());
              setAlertModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Set Alert</span>
          </button>
          <button
            onClick={() => setTradeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulasi Order</span>
          </button>
        </div>
      </div>

      {/* Main Price & Flash Display */}
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4 relative z-10">
        <div>
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider mb-1">Harga Real-Time</div>
          <div className={`text-4xl lg:text-5xl font-mono font-extrabold tracking-tight transition-all duration-300 ${
            flash === 'up'
              ? 'text-[#00ff87] drop-shadow-[0_0_15px_rgba(0,255,135,0.6)]'
              : flash === 'down'
              ? 'text-[#ff0055] drop-shadow-[0_0_15px_rgba(255,0,85,0.6)]'
              : 'text-white'
          }`}>
            {activeAsset.currency === 'IDR'
              ? `Rp ${activeAsset.price.toLocaleString()}`
              : `$${activeAsset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`}
          </div>
        </div>

        {/* 24h Change Pill */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-mono font-bold shadow-lg ${
          isPositive
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10'
        }`}>
          {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>24h Change: {isPositive ? '+' : ''}{activeAsset.change24h}%</span>
        </div>
      </div>

      {/* 24h Stats Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
          <span className="text-[10px] text-slate-500 font-mono uppercase">24h High</span>
          <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
            {activeAsset.currency === 'IDR' ? `Rp ${activeAsset.high24h.toLocaleString()}` : `$${activeAsset.high24h.toLocaleString()}`}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
          <span className="text-[10px] text-slate-500 font-mono uppercase">24h Low</span>
          <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
            {activeAsset.currency === 'IDR' ? `Rp ${activeAsset.low24h.toLocaleString()}` : `$${activeAsset.low24h.toLocaleString()}`}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
          <span className="text-[10px] text-slate-500 font-mono uppercase">24h Volume</span>
          <div className="text-xs font-mono font-semibold text-slate-200 mt-0.5">
            {activeAsset.currency === 'IDR'
              ? `Rp ${(activeAsset.volume24h / 1e9).toFixed(2)}B`
              : `$${(activeAsset.volume24h / 1e6).toFixed(2)}M`}
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
          <span className="text-[10px] text-slate-500 font-mono uppercase flex items-center justify-between">
            <span>Last Updated</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
          <div className="text-xs font-mono font-semibold text-cyan-400 mt-0.5 flex items-center gap-1.5">
            <span>{activeAsset.lastUpdated}</span>
            <span className="text-[9px] font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-md tracking-wider">
              LIVE REALTIME
            </span>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {tradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Simulasi Trade: {activeAsset.symbol}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Harga Eksekusi: <span className="text-cyan-400 font-mono">${activeAsset.price}</span>
            </p>

            <div className="mb-4">
              <label className="text-xs text-slate-300 font-medium block mb-1">Jumlah Unit:</label>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleExecuteTrade('BUY')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                Beli (Long)
              </button>
              <button
                onClick={() => handleExecuteTrade('SELL')}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-500/20"
              >
                Jual (Short)
              </button>
              <button
                onClick={() => setTradeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Set Price Alert: {activeAsset.symbol}</h3>
            <p className="text-xs text-slate-400 mb-4">Dapatkan notifikasi saat harga menyentuh target.</p>

            <div className="mb-4">
              <label className="text-xs text-slate-300 font-medium block mb-1">Target Harga ({activeAsset.currency}):</label>
              <input
                type="number"
                value={alertPriceInput}
                onChange={(e) => setAlertPriceInput(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSetAlert}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
              >
                Simpan Alert
              </button>
              <button
                onClick={() => setAlertModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
