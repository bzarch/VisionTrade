import { Kline, ConfluenceResult, SignalType } from '../../src/types';
import { calculateRSI } from './rsi';
import { calculateMACD } from './macd';
import { calculateSMA } from './sma';
import { calculateBollingerBands } from './bollinger';

export function calculateConfluence(klines: Kline[]): ConfluenceResult {
  if (!klines || klines.length === 0) {
    return {
      score: 50,
      signal: 'HOLD',
      reasons: ['Data klines tidak cukup untuk analisis'],
      breakdown: { rsiScore: 0, macdScore: 0, smaScore: 0, volumeScore: 0 }
    };
  }

  const currentPrice = klines[klines.length - 1].close;
  const currentVolume = klines[klines.length - 1].volume;

  const rsi = calculateRSI(klines, 14);
  const macd = calculateMACD(klines, 12, 26, 9);
  const sma25 = calculateSMA(klines, 25);

  // Calculate average volume over 20 periods
  const volSlice = klines.slice(-20);
  const avgVolume = volSlice.reduce((sum, k) => sum + k.volume, 0) / Math.max(1, volSlice.length);

  let rawScore = 50; // Base starting mid point
  const reasons: string[] = [];

  // 1. RSI Rule
  let rsiScore = 0;
  if (rsi < 30) {
    rsiScore = 30;
    reasons.push(`RSI (${rsi}) di area Oversold (< 30) - Potensi pembalikan arah bullish`);
  } else if (rsi > 70) {
    rsiScore = -30;
    reasons.push(`RSI (${rsi}) di area Overbought (> 70) - Tekanan jual meningkat`);
  } else if (rsi < 45) {
    rsiScore = 10;
    reasons.push(`RSI (${rsi}) di zona akumulasi netral-bullish`);
  } else if (rsi > 55) {
    rsiScore = -10;
    reasons.push(`RSI (${rsi}) mendekati area jenuh beli`);
  }

  // 2. MACD Histogram Rule
  let macdScore = 0;
  if (macd.histogram > 0) {
    macdScore = 25;
    reasons.push(`MACD Histogram positif (${macd.histogram}) - Momentum bullish aktif`);
  } else {
    macdScore = -25;
    reasons.push(`MACD Histogram negatif (${macd.histogram}) - Momentum bearish mendominasi`);
  }

  // 3. Price vs SMA 25 Rule
  let smaScore = 0;
  if (currentPrice > sma25) {
    smaScore = 20;
    reasons.push(`Harga (${currentPrice.toLocaleString()}) di atas SMA 25 (${sma25.toLocaleString()}) - Trend naik`);
  } else {
    smaScore = -20;
    reasons.push(`Harga (${currentPrice.toLocaleString()}) di bawah SMA 25 (${sma25.toLocaleString()}) - Trend turun`);
  }

  // 4. Volume vs Avg Volume Rule
  let volumeScore = 0;
  if (currentVolume > avgVolume) {
    volumeScore = 15;
    reasons.push(`Volume transaksi di atas rata-rata 20 periode (Konfirmasi pergerakan kuat)`);
  } else {
    volumeScore = -15;
    reasons.push(`Volume transaksi di bawah rata-rata (Konsolidasi/likuiditas rendah)`);
  }

  // Raw score sum: baseline 50 + (rsiScore + macdScore + smaScore + volumeScore) / 1.8
  const totalAdjustment = rsiScore + macdScore + smaScore + volumeScore; // Range: -90 to +90
  // Map range [-90, +90] to [0, 100]
  const normalizedScore = Math.max(0, Math.min(100, Math.round(50 + (totalAdjustment / 90) * 50)));

  let signal: SignalType = 'HOLD';
  if (normalizedScore > 65) {
    signal = 'BUY';
  } else if (normalizedScore < 35) {
    signal = 'SELL';
  } else {
    signal = 'HOLD';
  }

  return {
    score: normalizedScore,
    signal,
    reasons,
    breakdown: {
      rsiScore,
      macdScore,
      smaScore,
      volumeScore
    }
  };
}
