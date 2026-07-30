import React from 'react';
import { useMarketStore } from '../store/marketStore';
import { Calendar, Globe, AlertTriangle, TrendingUp, Sparkles, Clock, CheckCircle } from 'lucide-react';

export const EconomicCalendar: React.FC = () => {
  const { activeAsset } = useMarketStore();

  const events = [
    {
      id: 'e1',
      date: 'Hari Ini, 21:00 WIB',
      country: '🇺🇸 US',
      title: 'US CPI Inflation YoY',
      impact: 'HIGH',
      forecast: '2.8%',
      previous: '3.0%',
      actual: '2.7%',
      status: 'RELEASED',
      volatilityNote: 'Melandainya CPI mendorong ekspektasi pemotongan suku bunga Fed, memicu reli pada aset kripto dan saham teknologi.'
    },
    {
      id: 'e2',
      date: 'Besok, 01:00 WIB',
      country: '🇺🇸 US',
      title: 'FOMC Federal Reserve Rate Decision',
      impact: 'HIGH',
      forecast: '5.25%',
      previous: '5.50%',
      actual: 'TBA',
      status: 'UPCOMING',
      volatilityNote: 'Potensi volatilitas tinggi pada pasangan EUR/USD, Gold, dan BTC saat pengumuman konferensi pers Powell.'
    },
    {
      id: 'e3',
      date: 'Kamis, 14:00 WIB',
      country: '🇮🇩 ID',
      title: 'Bank Indonesia BI-Rate Decision',
      impact: 'HIGH',
      forecast: '6.00%',
      previous: '6.25%',
      actual: 'TBA',
      status: 'UPCOMING',
      volatilityNote: 'Sangat berdampak pada saham perbankan IDX (BBCA, BBRI, BMRI) serta stabilitas kurs Rupiah (USD/IDR).'
    },
    {
      id: 'e4',
      date: 'Jumat, 19:30 WIB',
      country: '🇺🇸 US',
      title: 'US Non-Farm Payrolls (NFP)',
      impact: 'HIGH',
      forecast: '175K',
      previous: '206K',
      actual: 'TBA',
      status: 'UPCOMING',
      volatilityNote: 'Data tenaga kerja menentukan arah pasar valuta asing dan saham global jelang penutupan pekan.'
    },
    {
      id: 'e5',
      date: 'Senin Depan, 16:00 WIB',
      country: '🇪🇺 EU',
      title: 'ECB Monetary Policy Statement',
      impact: 'MEDIUM',
      forecast: '3.75%',
      previous: '4.00%',
      actual: 'TBA',
      status: 'UPCOMING',
      volatilityNote: 'Mempengaruhi dinamika EUR/USD dan pasar obligasi Eropa.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Kalender Ekonomi & Radar Makro
            </h2>
            <p className="text-xs text-slate-400">
              Jadwal rilis indikator ekonomi global bereputasi tinggi yang menggerakkan likuiditas pasar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-2xl text-purple-300 text-xs font-mono">
          <Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
          <span>Analisis Dampak Gemini 3.6 Flash</span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{evt.country}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{evt.title}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      evt.impact === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {evt.impact} IMPACT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{evt.date}</span>
                  </div>
                </div>
              </div>

              {/* Data Values Grid */}
              <div className="flex items-center gap-4 bg-white/[0.03] px-4 py-2 rounded-2xl border border-white/10 text-xs font-mono">
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
              <AlertTriangle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-purple-300">Proyeksi Volatilitas AI: </span>
                {evt.volatilityNote}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
