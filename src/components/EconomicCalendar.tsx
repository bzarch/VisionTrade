import React, { useEffect, useState, useCallback } from 'react';
import { Calendar, Globe, AlertTriangle, Sparkles, Clock, RotateCw, Radio, Search, Filter, Zap, CheckCircle2, Flame } from 'lucide-react';

interface CalendarEvent {
  id: string;
  date: string;
  country: string;
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  forecast: string;
  previous: string;
  actual: string;
  status: 'RELEASED' | 'LIVE NOW' | 'UPCOMING';
  volatilityNote: string;
  category?: string;
}

export const EconomicCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchCalendarEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/calendar');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setEvents(json.data);
        setLastUpdated(json.updatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (e) {
      console.error('Error fetching economic calendar:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  // Auto Refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchCalendarEvents();
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, fetchCalendarEvents]);

  // Country flags extract
  const countries = ['ALL', '🇺🇸 US', '🇮🇩 ID', '🇪🇺 EU', '🇨🇳 CN', '🇯🇵 JP'];

  // Filter logic
  const filteredEvents = events.filter((evt) => {
    const matchesCountry = selectedCountry === 'ALL' || evt.country.includes(selectedCountry.replace(/[^A-Z]/g, ''));
    const matchesImpact = selectedImpact === 'ALL' || evt.impact === selectedImpact;
    const matchesSearch = searchQuery === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.volatilityNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesImpact && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Kalender Ekonomi Real-Time & Radar Makro
              </h2>
              {autoRefresh && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> LIVE SYNC
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Jadwal rilis indikator ekonomi global bereputasi tinggi yang menggerakkan likuiditas pasar secara langsung
            </p>
          </div>
        </div>

        {/* Live Refresh Control Toolbar */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {lastUpdated && (
            <span className="text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-xl">
              Diperbarui: <span className="text-cyan-300 font-bold">{lastUpdated}</span>
            </span>
          )}

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

          <button
            onClick={fetchCalendarEvents}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isLoading ? 'Updating...' : 'Refresh Kalender'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari indikator makro (misal: CPI, FOMC, BI-Rate, NFP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Filter */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  selectedCountry === c
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'ALL' ? '🌐 Semua Negara' : c}
              </button>
            ))}
          </div>

          {/* Impact Filter */}
          <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/10">
            {(['ALL', 'HIGH', 'MEDIUM'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setSelectedImpact(imp)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedImpact === imp
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {imp === 'ALL' ? 'Dampak' : imp === 'HIGH' ? '🔥 High Impact' : '⚡ Medium'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 border border-white/10 rounded-3xl">
          <p className="text-xs text-slate-400 font-mono">
            Tidak ada agenda kalender ekonomi yang sesuai dengan kata kunci atau filter yang dipilih.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const isReleased = evt.status === 'RELEASED';
            const isLive = evt.status === 'LIVE NOW';

            return (
              <div
                key={evt.id}
                className={`p-5 rounded-3xl border backdrop-blur-xl transition-all duration-300 space-y-3 ${
                  isLive
                    ? 'bg-amber-500/[0.04] border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : isReleased
                    ? 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-white/[0.04] border border-white/10 rounded-2xl">{evt.country}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{evt.title}</h3>
                        
                        {/* Impact Badge */}
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          evt.impact === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {evt.impact} IMPACT
                        </span>

                        {/* Status Badge */}
                        {isLive && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3 text-amber-400 animate-bounce" /> LIVE NOW
                          </span>
                        )}
                        {isReleased && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> RELEASED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{evt.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Values Grid */}
                  <div className="flex items-center gap-4 bg-white/[0.03] px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-mono self-start sm:self-auto">
                    <div>
                      <div className="text-[10px] text-slate-500">PREVIOUS</div>
                      <div className="text-slate-300 font-bold">{evt.previous}</div>
                    </div>
                    <div className="border-l border-white/10 h-6" />
                    <div>
                      <div className="text-[10px] text-slate-500">FORECAST</div>
                      <div className="text-cyan-400 font-bold">{evt.forecast}</div>
                    </div>
                    <div className="border-l border-white/10 h-6" />
                    <div>
                      <div className="text-[10px] text-slate-500">ACTUAL</div>
                      <div className={`font-extrabold ${evt.actual === 'TBA' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {evt.actual}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Volatility Note */}
                <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs text-purple-200/90 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-300">Proyeksi Volatilitas AI (Gemini 3.6 Flash): </span>
                    {evt.volatilityNote}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
