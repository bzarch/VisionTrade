import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Sliders, Maximize2, Activity, Eye, EyeOff } from 'lucide-react';

export const ChartContainer: React.FC = () => {
  const { klines, timeframe, setTimeframe, activeAsset, indicators } = useMarketStore();
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [showRSI, setShowRSI] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  if (!klines || klines.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 h-[480px] flex items-center justify-center text-slate-400">
        Memuat data grafik candlestick & indikator...
      </div>
    );
  }

  // Build chart dataset with SMA & Bollinger values for visual overlays
  const chartData = klines.map((k, idx) => {
    // Generate smooth rolling SMA for line overlays
    const slice = klines.slice(Math.max(0, idx - 19), idx + 1);
    const sma20 = slice.reduce((acc, item) => acc + item.close, 0) / slice.length;

    const slice50 = klines.slice(Math.max(0, idx - 49), idx + 1);
    const sma50 = slice50.reduce((acc, item) => acc + item.close, 0) / slice50.length;

    const stdDev = Math.sqrt(
      slice.reduce((acc, item) => acc + Math.pow(item.close - sma20, 2), 0) / slice.length
    );

    const bollingerUpper = sma20 + 2 * stdDev;
    const bollingerLower = sma20 - 2 * stdDev;

    return {
      date: k.dateStr || new Date(k.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
      volume: k.volume,
      sma20: Number(sma20.toFixed(2)),
      sma50: Number(sma50.toFixed(2)),
      bollingerUpper: Number(bollingerUpper.toFixed(2)),
      bollingerLower: Number(bollingerLower.toFixed(2)),
      isBullish: k.close >= k.open
    };
  });

  const minPrice = Math.min(...klines.map(k => k.low)) * 0.995;
  const maxPrice = Math.max(...klines.map(k => k.high)) * 1.005;

  return (
    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col gap-4">
      {/* Chart Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
          {(['1m', '5m', '15m', '1h', '1d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Overlay Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
              showSMA ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-slate-500 border-white/5 bg-white/[0.02]'
            }`}
          >
            SMA (20/50)
          </button>
          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
              showBollinger ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'text-slate-500 border-white/5 bg-white/[0.02]'
            }`}
          >
            Bollinger Bands
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
              showVolume ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-slate-500 border-white/5 bg-white/[0.02]'
            }`}
          >
            Volume Bars
          </button>

          <button
            onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
            className="p-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white"
            title="Toggle Chart Type"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Technical Price Chart */}
      <div className="h-[340px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} />
            <YAxis domain={[minPrice, maxPrice]} stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} orientation="right" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              labelStyle={{ color: '#94a3b8', fontSize: '11px', fontFamily: 'monospace' }}
              itemStyle={{ fontSize: '12px', color: '#38bdf8' }}
            />

            {/* Price Area / Line */}
            {chartType === 'area' ? (
              <Area
                type="monotone"
                dataKey="close"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
                name="Harga"
              />
            ) : (
              <Line type="monotone" dataKey="close" stroke="#38bdf8" strokeWidth={2} dot={false} name="Harga" />
            )}

            {/* SMA 20 Overlay */}
            {showSMA && (
              <>
                <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="SMA 20" />
                <Line type="monotone" dataKey="sma50" stroke="#ec4899" strokeWidth={1.5} dot={false} name="SMA 50" />
              </>
            )}

            {/* Bollinger Bands Overlay */}
            {showBollinger && (
              <>
                <Line type="monotone" dataKey="bollingerUpper" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Bollinger Upper" />
                <Line type="monotone" dataKey="bollingerLower" stroke="#a855f7" strokeWidth={1} strokeDasharray="3 3" dot={false} name="Bollinger Lower" />
              </>
            )}

            {/* Volume Bars */}
            {showVolume && (
              <Bar dataKey="volume" yAxisId="vol" fill="#3b82f6" opacity={0.3} radius={[4, 4, 0, 0]} name="Volume" />
            )}
            <YAxis id="vol" orientation="left" domain={[0, 'auto']} hide />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Mini Indicator Panel */}
      {showRSI && indicators && (
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">RSI (14):</span>
            <span className={`font-bold text-sm px-2.5 py-0.5 rounded-lg ${
              indicators.rsi < 30 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              indicators.rsi > 70 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              'bg-slate-800 text-slate-200'
            }`}>
              {indicators.rsi} {indicators.rsi < 30 ? '(Oversold)' : indicators.rsi > 70 ? '(Overbought)' : '(Netral)'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>MACD Hist: <strong className={indicators.macd.histogram > 0 ? 'text-emerald-400' : 'text-rose-400'}>{indicators.macd.histogram}</strong></span>
            <span>Vol Ratio: <strong className="text-cyan-400">{indicators.volumeRatio}x</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
