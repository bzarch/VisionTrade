import { Kline } from '../../src/types';

function calculateEMA(prices: number[], period: number): number[] {
  const emaValues: number[] = [];
  const k = 2 / (period + 1);
  
  // Start with SMA for initial value
  let sum = 0;
  for (let i = 0; i < Math.min(period, prices.length); i++) {
    sum += prices[i];
  }
  let prevEMA = sum / Math.min(period, prices.length);
  emaValues.push(prevEMA);

  for (let i = period; i < prices.length; i++) {
    const currentEMA = prices[i] * k + prevEMA * (1 - k);
    emaValues.push(currentEMA);
    prevEMA = currentEMA;
  }
  return emaValues;
}

export function calculateMACD(
  klines: Kline[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) {
  if (klines.length < slowPeriod + signalPeriod) {
    return { macdLine: 0, signalLine: 0, histogram: 0 };
  }

  const closes = klines.map(k => k.close);
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  // MACD line = Fast EMA - Slow EMA
  const macdLineArray: number[] = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);
  
  for (let i = 0; i < minLength; i++) {
    macdLineArray.push(fastEMA[fastEMA.length - minLength + i] - slowEMA[slowEMA.length - minLength + i]);
  }

  const signalEMA = calculateEMA(macdLineArray, signalPeriod);
  
  const latestMACD = macdLineArray[macdLineArray.length - 1] || 0;
  const latestSignal = signalEMA[signalEMA.length - 1] || 0;
  const histogram = latestMACD - latestSignal;

  return {
    macdLine: Number(latestMACD.toFixed(4)),
    signalLine: Number(latestSignal.toFixed(4)),
    histogram: Number(histogram.toFixed(4)),
  };
}
