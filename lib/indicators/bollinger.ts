import { Kline } from '../../src/types';
import { calculateSMA } from './sma';

export function calculateBollingerBands(klines: Kline[], period: number = 20, multiplier: number = 2) {
  if (klines.length < period) {
    const lastClose = klines[klines.length - 1]?.close || 0;
    return { upper: lastClose, middle: lastClose, lower: lastClose, percentB: 0.5 };
  }

  const middle = calculateSMA(klines, period);
  const slice = klines.slice(-period);
  const mean = slice.reduce((acc, k) => acc + k.close, 0) / period;
  
  const variance = slice.reduce((acc, k) => acc + Math.pow(k.close - mean, 2), 0) / period;
  const stdDev = Math.sqrt(variance);

  const upper = middle + multiplier * stdDev;
  const lower = middle - multiplier * stdDev;
  const currentClose = klines[klines.length - 1].close;

  const percentB = upper !== lower ? (currentClose - lower) / (upper - lower) : 0.5;

  return {
    upper: Number(upper.toFixed(4)),
    middle: Number(middle.toFixed(4)),
    lower: Number(lower.toFixed(4)),
    percentB: Number(percentB.toFixed(4)),
  };
}
