import { Asset, Kline } from '../../src/types';

export interface DataAdapter {
  name: string;
  getAssets(): Promise<Asset[]>;
  getKlines(symbol: string, interval?: string, limit?: number): Promise<Kline[]>;
  getTicker(symbol: string): Promise<Asset | null>;
}
