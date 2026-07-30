import React, { useState, useEffect } from 'react';
import { useMarketStore } from '../store/marketStore';
import { Calculator, ShieldAlert, Target, DollarSign, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

export const RiskCalculator: React.FC = () => {
  const { activeAsset, addPortfolioTrade } = useMarketStore();

  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2); // 2%
  const [entryPrice, setEntryPrice] = useState<number>(activeAsset?.price || 50000);
  const [stopLoss, setStopLoss] = useState<number>(activeAsset ? activeAsset.price * 0.96 : 48000);
  const [takeProfit, setTakeProfit] = useState<number>(activeAsset ? activeAsset.price * 1.08 : 54000);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [isExecuted, setIsExecuted] = useState<boolean>(false);

  useEffect(() => {
    if (activeAsset) {
      setEntryPrice(activeAsset.price);
      if (tradeType === 'BUY') {
        setStopLoss(Number((activeAsset.price * 0.96).toFixed(2)));
        setTakeProfit(Number((activeAsset.price * 1.08).toFixed(2)));
      } else {
        setStopLoss(Number((activeAsset.price * 1.04).toFixed(2)));
        setTakeProfit(Number((activeAsset.price * 0.92).toFixed(2)));
      }
    }
  }, [activeAsset, tradeType]);

  // Math calculation
  const amountToRisk = (accountBalance * riskPercent) / 100;
  const priceDistanceSL = Math.abs(entryPrice - stopLoss);
  const priceDistanceTP = Math.abs(takeProfit - entryPrice);

  const positionSizeUnits = priceDistanceSL > 0 ? amountToRisk / priceDistanceSL : 0;
  const potentialProfit = positionSizeUnits * priceDistanceTP;
  const riskRewardRatio = priceDistanceSL > 0 ? (priceDistanceTP / priceDistanceSL).toFixed(2) : '0.00';

  const handleExecuteTrade = () => {
    if (positionSizeUnits <= 0) return;
    addPortfolioTrade(tradeType, Number(positionSizeUnits.toFixed(4)));
    setIsExecuted(true);
    setTimeout(() => setIsExecuted(false), 3000);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Kalkulator Risk/Reward & Trade Simulator
              <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                {activeAsset?.symbol || 'BTC/USDT'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Kalkulasi matematis presisi ukuran posisi, toleransi risiko modal, dan rasio RRR sebelum eksekusi
            </p>
          </div>
        </div>

        {/* Long/Short Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setTradeType('BUY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tradeType === 'BUY'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🟢 LONG / BUY
          </button>
          <button
            onClick={() => setTradeType('SELL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tradeType === 'SELL'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 SHORT / SELL
          </button>
        </div>
      </div>

      {/* Main Form & Interactive Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Account Capital */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Total Modal Akun ($ / IDR)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Risk Percentage */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Toleransi Risiko per Trade (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
                />
                <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-3 py-2.5 rounded-2xl">
                  ${amountToRisk.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Harga Entry
              </label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Stop Loss */}
            <div>
              <label className="block text-xs font-mono text-rose-400 mb-1 flex items-center justify-between">
                <span>Stop Loss (SL)</span>
                <span>-{Math.abs(((stopLoss - entryPrice) / entryPrice) * 100).toFixed(2)}%</span>
              </label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-2.5 text-sm font-mono text-rose-300 focus:outline-none focus:border-rose-500/60"
              />
            </div>

            {/* Take Profit */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-emerald-400 mb-1 flex items-center justify-between">
                <span>Take Profit Target (TP)</span>
                <span>+{Math.abs(((takeProfit - entryPrice) / entryPrice) * 100).toFixed(2)}%</span>
              </label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(Number(e.target.value))}
                className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/60"
              />
            </div>

          </div>
        </div>

        {/* Right Output Display & Simulation Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
              Hasil Kalkulasi Parameter Trade
            </div>

            <div className="space-y-3">
              {/* Position Size */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Ukuran Posisi Direkomendasikan:</span>
                <span className="text-base font-extrabold font-mono text-cyan-300">
                  {positionSizeUnits.toFixed(4)} <span className="text-xs font-normal text-slate-400">{activeAsset?.symbol.split('/')[0]}</span>
                </span>
              </div>

              {/* Max Loss vs Max Profit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-[10px] font-mono text-rose-300 uppercase">Maksimum Risiko ($)</div>
                  <div className="text-sm font-bold font-mono text-rose-400">-${amountToRisk.toFixed(2)}</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-mono text-emerald-300 uppercase">Proyeksi Profit ($)</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">+${potentialProfit.toFixed(2)}</div>
                </div>
              </div>

              {/* Risk Reward Ratio Meter */}
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-indigo-300 uppercase">Risk : Reward Ratio</div>
                  <div className="text-xs text-slate-400">
                    {Number(riskRewardRatio) >= 2.0 ? 'Ideal (Sangat Bagus)' : 'Perlu Dipertimbangkan'}
                  </div>
                </div>
                <div className="text-xl font-extrabold font-mono text-indigo-300">
                  1 : {riskRewardRatio}
                </div>
              </div>
            </div>
          </div>

          {/* Action Execution Button */}
          <button
            onClick={handleExecuteTrade}
            disabled={isExecuted || positionSizeUnits <= 0}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              isExecuted
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 active:scale-95'
            }`}
          >
            {isExecuted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Simulasi Trade Berhasil Ditambahkan ke Portfolio!</span>
              </>
            ) : (
              <>
                <span>Buka Posisi Simulasi di Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
