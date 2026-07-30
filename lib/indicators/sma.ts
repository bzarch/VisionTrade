import { Kline } from '../../src/types';

export function calculateSMA(klines: Kline[], period: number): number {
  if (klines.length === 0) return 0;
  const count = Math.min(klines.length, period);
  const slice = klines.slice(-count);
  const sum = slice.reduce((acc, k) => acc + k.close, 0);
  return Number((sum / count).toFixed(4));
}
