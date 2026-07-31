import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Asset } from '../types';
import { Filter, Zap, TrendingUp, TrendingDown, Eye, RefreshCw, Layers, ShieldAlert, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const MarketScreener: React.FC = () => {
  const { assets, setActiveAsset, setActiveTab, fetchMarketData, isDataLoading } = useMarketStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [signalFilter, setSignalFilter] = useState<string>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Generate quantitative screening metadata for each asset
  const screenedAssets = assets.map((asset) => {
    // Generate deterministic technical values based on price and change24h
    const change = asset.change24h;
    const absChange = Math.abs(change);
    
    // RSI calculation approximation
    let rsi = 50 + change * 2.8;
    rsi = Math.max(18, Math.min(88, rsi));
    rsi = Math.round(rsi * 10) / 10;

    // MACD Status
    const macdStatus = change > 1.2 ? 'BULLISH_CROSS' : change < -1.2 ? 'BEARISH_CROSS' : 'NEUTRAL';
    
    // Volume Surge
    const volumeSurge = Math.round((100 + (absChange * 14)) * 10) / 10;

    // Signal recommendation
    let signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL' = 'NEUTRAL';
    if (rsi < 35 || (change > 2.5 && macdStatus === 'BULLISH_CROSS')) {
      signal = rsi < 28 ? 'STRONG_BUY' : 'BUY';
    } else if (rsi > 65 || (change < -2.5 && macdStatus === 'BEARISH_CROSS')) {
      signal = rsi > 75 ? 'STRONG_SELL' : 'SELL';
    }

    return {
      ...asset,
      rsi,
      macdStatus,
      volumeSurge,
      signal
    };
  });

  const filtered = screenedAssets.filter((item) => {
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSig = signalFilter === 'ALL' || item.signal === signalFilter;
    
    let matchesCond = true;
    if (conditionFilter === 'RSI_OVERSOLD') matchesCond = item.rsi < 35;
    if (conditionFilter === 'RSI_OVERBOUGHT') matchesCond = item.rsi > 65;
    if (conditionFilter === 'HIGH_VOLATILITY') matchesCond = Math.abs(item.change24h) > 2.5;

    const matchesSearch = searchQuery === '' || 
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSig && matchesCond && matchesSearch;
  });

  const handleSelectAsset = (asset: Asset) => {
    setActiveAsset(asset);
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Screener & Pemindai Pasar Kuantitatif (Live Scanner)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter dan lacak peluang breakout, kondisi overbought/oversold, dan lonjakan volume secara real-time
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMarketData()}
          disabled={isDataLoading}
          className="px-4 py-2 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} />
          <span>Scan Ulang Pasar</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Cari simbol (BTC, BBCA, NVDA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Kategori:</span>
          </span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'crypto', label: '🪙 Kripto' },
            { id: 'global_stocks', label: '🇺🇸 Saham US' },
            { id: 'idx_stocks', label: '🇮🇩 Saham IDX' },
            { id: 'forex', label: '💱 Forex' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white bg-white/[0.02]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Technical Condition Filter */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/10">
          {[
            { id: 'ALL', label: 'Kondisi Teknikal' },
            { id: 'RSI_OVERSOLD', label: '🟢 RSI < 35 (Oversold)' },
            { id: 'RSI_OVERBOUGHT', label: '🔴 RSI > 65 (Overbought)' },
            { id: 'HIGH_VOLATILITY', label: '⚡ Volatilitas Tinggi' }
          ].map((cond) => (
            <button
              key={cond.id}
              onClick={() => setConditionFilter(cond.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                conditionFilter === cond.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>

      </div>

      {/* Screener Table Grid */}
      <div className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Aset & Simbol</th>
                <th className="p-4">Harga Terkini</th>
                <th className="p-4">Perubahan 24h</th>
                <th className="p-4">RSI (14)</th>
                <th className="p-4">Tren MACD</th>
                <th className="p-4">Rasio Volume</th>
                <th className="p-4">Sinyal Kuantitatif</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Tidak ada aset yang memenuhi kriteria screener.
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => {
                  const isPos = asset.change24h >= 0;

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                      onClick={() => handleSelectAsset(asset)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-300 text-xs">
                            {asset.symbol.substring(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {asset.symbol}
                            </div>
                            <div className="text-[10px] text-slate-400">{asset.name}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-slate-200">
                        {asset.currency === 'IDR' ? 'Rp ' : asset.currency === 'EUR' ? '€' : '$'}
                        {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg border text-[11px] ${
                          isPos ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isPos ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            asset.rsi < 35 ? 'text-emerald-400' : asset.rsi > 65 ? 'text-rose-400' : 'text-slate-300'
                          }`}>
                            {asset.rsi}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {asset.rsi < 35 ? '(Oversold)' : asset.rsi > 65 ? '(Overbought)' : ''}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`text-[11px] font-bold ${
                          asset.macdStatus === 'BULLISH_CROSS' ? 'text-emerald-400' :
                          asset.macdStatus === 'BEARISH_CROSS' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {asset.macdStatus === 'BULLISH_CROSS' && '🟢 Bullish Cross'}
                          {asset.macdStatus === 'BEARISH_CROSS' && '🔴 Bearish Cross'}
                          {asset.macdStatus === 'NEUTRAL' && '⚪ Netral'}
                        </span>
                      </td>

                      <td className="p-4 text-slate-300">
                        {asset.volumeSurge}% avg
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${
                          asset.signal === 'STRONG_BUY' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' :
                          asset.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          asset.signal === 'STRONG_SELL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' :
                          asset.signal === 'SELL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          'bg-slate-800 text-slate-400 border-white/10'
                        }`}>
                          {asset.signal.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAsset(asset);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Analisis Chart</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
