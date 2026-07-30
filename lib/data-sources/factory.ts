import { DataAdapter } from './base-adapter';
import { BinanceAdapter } from './binance-adapter';
import { YahooFinanceAdapter } from './yahoo-adapter';
import { BagusktoSahamAdapter } from './baguskto-adapter';
import { ForexAdapter } from './itick-adapter';
import { Asset, Kline, DataSource } from '../../src/types';

export class DataSourceFactory {
  private binance = new BinanceAdapter();
  private yahoo = new YahooFinanceAdapter();
  private idx = new BagusktoSahamAdapter();
  private forex = new ForexAdapter();

  async getAllAssets(): Promise<Asset[]> {
    try {
      const [crypto, stocks, idxStocks, fx] = await Promise.all([
        this.binance.getAssets(),
        this.yahoo.getAssets(),
        this.idx.getAssets(),
        this.forex.getAssets(),
      ]);

      const all = [...crypto, ...stocks, ...idxStocks, ...fx];
      const seen = new Set<string>();
      return all.filter(asset => {
        const key = asset.id.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } catch (e) {
      console.error('Error fetching assets from adapters:', e);
      const crypto = await this.binance.getAssets();
      return crypto;
    }
  }

  async getAssetsBySource(source: DataSource): Promise<Asset[]> {
    switch (source) {
      case 'binance':
      case 'coingecko':
        return this.binance.getAssets();
      case 'yahoo':
        return this.yahoo.getAssets();
      case 'idx':
        return this.idx.getAssets();
      case 'exchangerate':
        return this.forex.getAssets();
      default:
        return this.getAllAssets();
    }
  }

  async getKlines(symbol: string, source?: DataSource, interval: string = '1h', limit: number = 60): Promise<Kline[]> {
    const cleanSymbol = symbol.toUpperCase();

    if (cleanSymbol.includes('BTC') || cleanSymbol.includes('ETH') || cleanSymbol.includes('SOL') || cleanSymbol.includes('BNB') || cleanSymbol.includes('XRP') || cleanSymbol.includes('ADA')) {
      return this.binance.getKlines(symbol, interval, limit);
    }

    if (cleanSymbol.includes('BBCA') || cleanSymbol.includes('TLKM') || cleanSymbol.includes('BBRI') || cleanSymbol.includes('ASII') || cleanSymbol.includes('UNVR') || cleanSymbol.includes('GOTO') || cleanSymbol.includes('BMRI')) {
      return this.idx.getKlines(symbol, interval, limit);
    }

    if (cleanSymbol.includes('EUR') || cleanSymbol.includes('GBP') || cleanSymbol.includes('JPY') || cleanSymbol.includes('AUD') || cleanSymbol.includes('IDR')) {
      return this.forex.getKlines(symbol, interval, limit);
    }

    return this.yahoo.getKlines(symbol, interval, limit);
  }
}

export const factory = new DataSourceFactory();
