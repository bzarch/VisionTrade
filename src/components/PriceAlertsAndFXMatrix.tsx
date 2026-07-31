import React, { useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Bell, BellOff, Plus, Trash2, ArrowRightLeft, DollarSign, Globe, CheckCircle2, AlertTriangle, Zap, Volume2 } from 'lucide-react';

export const PriceAlertsAndFXMatrix: React.FC = () => {
  const { alerts, addPriceAlert, removePriceAlert, activeAsset, assets } = useMarketStore();
  const [targetPriceInput, setTargetPriceInput] = useState<string>('');
  const [conditionInput, setConditionInput] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [converterAmount, setConverterAmount] = useState<number>(1000);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('IDR');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPriceInput);
    if (!isNaN(priceNum) && priceNum > 0) {
      addPriceAlert(priceNum, conditionInput);
      setTargetPriceInput('');
      
      // Play audio notification beep if supported
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (err) {
        // Ignore audio errors
      }
    }
  };

  // FX Matrix rates baseline
  const fxRates: Record<string, number> = {
    USD: 1.0,
    IDR: 16250.0,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 154.5,
    SGD: 1.35,
    AUD: 1.52,
    XAU: 0.00041 // Gold per USD
  };

  const convertFx = (amount: number, from: string, to: string) => {
    const amountInUsd = amount / (fxRates[from] || 1);
    const converted = amountInUsd * (fxRates[to] || 1);
    return converted;
  };

  const convertedValue = convertFx(converterAmount, fromCurr, toCurr);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Sistem Notifikasi Harga & Konverter Mata Uang FX
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pasang alarm target harga otomatis dan hitung nilai tukar lintas mata uang global secara instant
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Price Alert Manager */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Buat Notifikasi Alert Harga</h3>
            </div>
            {activeAsset && (
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-xl">
                Aset Aktif: {activeAsset.symbol} (${activeAsset.price.toLocaleString()})
              </span>
            )}
          </div>

          {/* Alert Form */}
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Kondisi Trigger</label>
                <select
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value as 'ABOVE' | 'BELOW')}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="ABOVE">↗️ Naik di Atas (Above)</option>
                  <option value="BELOW">↘️ Turun di Bawah (Below)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase mb-1 block">Target Harga</label>
                <input
                  type="number"
                  step="any"
                  placeholder={`E.g. ${activeAsset ? activeAsset.price : 95000}`}
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Aktifkan Alert untuk {activeAsset?.symbol || 'BTC/USDT'}</span>
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Daftar Alert Aktif ({alerts.length})</span>
              <span className="text-[10px] text-amber-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Audio Beep Active
              </span>
            </h4>

            {alerts.length === 0 ? (
              <div className="p-6 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 font-mono">Belum ada alert harga yang diset.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{alt.symbol}</div>
                        <div className="text-[10px] text-slate-400">
                          Target: {alt.condition === 'ABOVE' ? '↗️ >' : '↘️ <'}{' '}
                          <span className="text-amber-300 font-bold">{alt.targetPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        ACTIVE
                      </span>
                      <button
                        onClick={() => removePriceAlert(alt.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Hapus Alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: FX Cross Matrix & Currency Converter */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Matrix Forex & Kalkulator Nilai Tukar</h3>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-xl">
              Live Rates
            </span>
          </div>

          {/* Quick Currency Converter */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="text-xs font-bold text-slate-200">Kalkulator Konversi Kurs Instant</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5">
                <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Jumlah</label>
                <input
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Dari</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-white font-mono"
                >
                  {Object.keys(fxRates).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-mono text-slate-400 uppercase mb-1 block">Ke</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-2 py-2 text-xs text-white font-mono"
                >
                  {Object.keys(fxRates).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Box */}
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between font-mono">
              <span className="text-xs text-indigo-300">Hasil Konversi:</span>
              <span className="text-base font-extrabold text-white">
                {converterAmount.toLocaleString()} {fromCurr} ={' '}
                <span className="text-cyan-400">
                  {convertedValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurr}
                </span>
              </span>
            </div>
          </div>

          {/* FX Rates Reference Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Patokan Exchange Rates (Terhadap USD)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">USD/IDR</div>
                <div className="font-bold text-emerald-400">Rp 16.250</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">EUR/USD</div>
                <div className="font-bold text-white">1.0870</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">GBP/USD</div>
                <div className="font-bold text-white">1.2820</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">USD/JPY</div>
                <div className="font-bold text-white">154.50</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
