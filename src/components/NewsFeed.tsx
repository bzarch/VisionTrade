import React, { useEffect, useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { NewsItem } from '../types';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const { news } = useMarketStore();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setNewsList(json.data);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const displayed = (newsList.length > 0 ? newsList : news).filter(n => {
    if (filter === 'ALL') return true;
    return n.sentiment === filter;
  });

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live News & Sentiment Feed</h3>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
          {(['ALL', 'BULLISH', 'BEARISH'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map((item) => {
          const isBull = item.sentiment === 'BULLISH';
          const isBear = item.sentiment === 'BEARISH';

          return (
            <div
              key={item.id}
              className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                    {item.impactCategory}
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isBull ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    isBear ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                    'bg-slate-800 text-slate-300 border-white/10'
                  }`}>
                    {isBull ? <TrendingUp className="w-3 h-3" /> : isBear ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    <span>{item.sentiment} ({item.sentimentScore > 0 ? '+' : ''}{item.sentimentScore})</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-100 leading-snug hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                <span>{item.source} • {item.publishedAt}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline font-mono"
                >
                  <span>Baca Artikel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
