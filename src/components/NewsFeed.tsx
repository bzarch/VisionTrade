import React, { useEffect, useState, useCallback } from 'react';
import { useMarketStore } from '../store/marketStore';
import { NewsItem } from '../types';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, RotateCw, Search, Radio, Filter, Zap } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const { news } = useMarketStore();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH' | 'NEUTRAL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchNewsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setNewsList(json.data);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      console.error('Error fetching live news:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  // Auto Refresh Interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchNewsData();
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, fetchNewsData]);

  const sourceList = newsList.length > 0 ? newsList : news;

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(sourceList.map(n => n.impactCategory || 'Market')))];

  const displayed = sourceList.filter(n => {
    const matchesSentiment = filter === 'ALL' || n.sentiment === filter;
    const matchesCategory = categoryFilter === 'ALL' || (n.impactCategory && n.impactCategory.toLowerCase() === categoryFilter.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSentiment && matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-5">
      
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">Live News & Market Sentiment Stream</h3>
              {autoRefresh && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE SYNC
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Umpan berita real-time terkoneksi langsung dengan analisis sentimen kuantitatif
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Last Updated badge */}
          {lastUpdated && (
            <span className="text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-xl">
              Diperbarui: <span className="text-cyan-300 font-bold">{lastUpdated}</span>
            </span>
          )}

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle Auto Refresh Stream (20s)"
          >
            <Zap className={`w-3.5 h-3.5 ${autoRefresh ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{autoRefresh ? 'Auto Sync ON' : 'Auto Sync OFF'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={fetchNewsData}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci berita (misal: Bitcoin, Fed, IHSG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          {(['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'ALL' && '🌐 Semua Sentimen'}
              {f === 'BULLISH' && '🟢 Bullish'}
              {f === 'BEARISH' && '🔴 Bearish'}
              {f === 'NEUTRAL' && '⚪ Netral'}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Kategori:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-xl font-mono text-[11px] transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      )}

      {/* News Grid */}
      {displayed.length === 0 ? (
        <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-xs text-slate-400 font-mono">
            Tidak ditemukan berita yang cocok dengan kriteria filter "{searchQuery || filter}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((item) => {
            const isBull = item.sentiment === 'BULLISH';
            const isBear = item.sentiment === 'BEARISH';

            return (
              <div
                key={item.id}
                className="bg-white/[0.03] border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.04] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-md">
                      {item.impactCategory}
                    </span>
                    <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      isBull ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      isBear ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-slate-800 text-slate-300 border-white/10'
                    }`}>
                      {isBull ? <TrendingUp className="w-3 h-3" /> : isBear ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      <span>{item.sentiment} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-slate-400">{item.source} • {item.publishedAt}</span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                  >
                    <span>Baca Lengkap</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
