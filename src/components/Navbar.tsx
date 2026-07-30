import React from 'react';
import { useMarketStore } from '../store/marketStore';
import {
  Sparkles,
  Search,
  Activity,
  Zap,
  Layers,
  BarChart2,
  PieChart,
  Newspaper,
  Globe
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeCategory,
    setCategory,
    activeSource,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    activeAsset
  } = useMarketStore();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/60 border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & AI Tag */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/90 rounded-[15px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  VisionTrade <span className="text-cyan-400 font-extrabold">Pro</span>
                </h1>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  visionOS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Spatial Trading Dashboard & Gemini 3.6 Flash Engine
              </p>
            </div>
          </div>

          {/* Gemini AI Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
            <span className="hidden sm:inline">Gemini 3.6 Flash</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        {/* Search & Navigation Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aset (BTC, BBCA, AAPL, EUR)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Main View Tabs */}
          <nav className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Analisis</span>
            </button>
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'grid'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Watchlist</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Risk & Setup</span>
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'heatmap'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Heatmap</span>
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kalender Makro</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'news'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Berita</span>
            </button>
          </nav>
        </div>

      </div>

      {/* Asset Categories Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Kategori:</span>
          {(['crypto', 'global_stocks', 'idx_stocks', 'forex'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              {cat === 'crypto' && '🪙 Crypto'}
              {cat === 'global_stocks' && '🇺🇸 Saham US'}
              {cat === 'idx_stocks' && '🇮🇩 Saham IDX'}
              {cat === 'forex' && '💱 Forex'}
            </button>
          ))}
        </div>

        {/* Current Active Source Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Sumber Data:</span>
          <span className="font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20 uppercase">
            {activeSource}
          </span>
        </div>
      </div>
    </header>
  );
};
