import { DataAdapter } from './base-adapter';
import { Asset, Kline } from '../../src/types';
import { YahooFinanceAdapter } from './yahoo-adapter';

export class BagusktoSahamAdapter implements DataAdapter {
  name = 'idx';
  private yahooFallback = new YahooFinanceAdapter();

  private idxAssets = [
    { symbol: 'BBCA', name: 'Bank Central Asia Tbk', price: 10425, change: 1.22, mcap: 'Rp 1.285 T', pe: 24.8, pbv: 4.8, roe: 21.5, div: 2.8, margin: 42.5 },
    { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4890, change: 2.08, mcap: 'Rp 741 T', pe: 12.4, pbv: 2.2, roe: 18.2, div: 6.8, margin: 31.2 },
    { symbol: 'BMRI', name: 'Bank Mandiri Tbk', price: 7150, change: 1.78, mcap: 'Rp 667 T', pe: 11.8, pbv: 2.1, roe: 19.8, div: 5.4, margin: 34.5 },
    { symbol: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 5450, change: 0.93, mcap: 'Rp 203 T', pe: 9.8, pbv: 1.2, roe: 14.5, div: 5.2, margin: 28.4 },
    { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', price: 2950, change: -0.67, mcap: 'Rp 292 T', pe: 12.2, pbv: 2.1, roe: 16.8, div: 6.2, margin: 18.2 },
    { symbol: 'ASII', name: 'Astra International Tbk', price: 5125, change: -1.44, mcap: 'Rp 207 T', pe: 6.8, pbv: 1.0, roe: 15.2, div: 8.5, margin: 10.4 },
    { symbol: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2280, change: 0.44, mcap: 'Rp 87 T', pe: 18.4, pbv: 22.5, roe: 88.5, div: 4.8, margin: 14.2 },
    { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 68, change: 3.03, mcap: 'Rp 81 T', pe: -12.4, pbv: 0.8, roe: -8.2, div: 0.0, margin: -12.5 },
    { symbol: 'AMMN', name: 'Amman Mineral Internasional', price: 11850, change: 4.22, mcap: 'Rp 858 T', pe: 48.5, pbv: 8.4, roe: 22.4, div: 0.0, margin: 28.5 },
    { symbol: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 3650, change: 1.82, mcap: 'Rp 112 T', pe: 4.2, pbv: 0.9, roe: 24.8, div: 14.2, margin: 28.2 },
    { symbol: 'BREN', name: 'Barito Renewables Energy', price: 8950, change: 2.88, mcap: 'Rp 1.197 T', pe: 420.0, pbv: 112.0, roe: 38.5, div: 0.2, margin: 38.2 },
    { symbol: 'TPIA', name: 'Chandra Asri Petrochemical', price: 9425, change: -0.52, mcap: 'Rp 815 T', pe: 180.2, pbv: 18.4, roe: 2.8, div: 0.0, margin: 2.1 },
    { symbol: 'PTBA', name: 'Bukit Asam Tbk', price: 2720, change: 0.74, mcap: 'Rp 31 T', pe: 5.8, pbv: 1.4, roe: 28.2, div: 15.8, margin: 18.4 },
    { symbol: 'ANTM', name: 'Aneka Tambang Tbk', price: 1540, change: 1.32, mcap: 'Rp 37 T', pe: 12.8, pbv: 1.5, roe: 13.4, div: 6.2, margin: 8.5 },
    { symbol: 'ICBP', name: 'Indofood CBP Sukses Makmur', price: 11200, change: 0.45, mcap: 'Rp 130 T', pe: 14.8, pbv: 3.1, roe: 21.4, div: 3.2, margin: 12.8 },
    { symbol: 'INDF', name: 'Indofood Sukses Makmur Tbk', price: 6850, change: -0.36, mcap: 'Rp 60 T', pe: 6.8, pbv: 1.1, roe: 16.5, div: 4.8, margin: 8.4 },
    { symbol: 'CPIN', name: 'Charoen Pokphand Indonesia', price: 5125, change: 0.98, mcap: 'Rp 84 T', pe: 24.2, pbv: 2.8, roe: 12.4, div: 2.2, margin: 4.8 },
    { symbol: 'PGAS', name: 'Perusahaan Gas Negara Tbk', price: 1585, change: 2.26, mcap: 'Rp 38 T', pe: 7.2, pbv: 0.8, roe: 11.8, div: 9.4, margin: 8.2 },
    { symbol: 'KLBF', name: 'Kalbe Farma Tbk', price: 1640, change: -0.61, mcap: 'Rp 76 T', pe: 22.8, pbv: 3.4, roe: 15.2, div: 2.4, margin: 10.8 },
    { symbol: 'HRUM', name: 'Harum Energy Tbk', price: 1320, change: 1.15, mcap: 'Rp 17 T', pe: 6.2, pbv: 0.9, roe: 18.4, div: 8.2, margin: 22.4 },
    { symbol: 'MDKA', name: 'Merdeka Copper Gold Tbk', price: 2380, change: 2.15, mcap: 'Rp 57 T', pe: 88.2, pbv: 3.2, roe: 3.8, div: 0.0, margin: 4.2 },
    { symbol: 'INKP', name: 'Indah Kiat Pulp & Paper', price: 8250, change: -0.90, mcap: 'Rp 45 T', pe: 6.4, pbv: 0.5, roe: 8.2, div: 2.4, margin: 14.8 },
    { symbol: 'TKIM', name: 'Pabrik Kertas Tjiwi Kimia', price: 7425, change: -0.67, mcap: 'Rp 23 T', pe: 5.8, pbv: 0.4, roe: 7.4, div: 2.1, margin: 12.4 },
    { symbol: 'SMGR', name: 'Semen Indonesia Tbk', price: 3950, change: 1.28, mcap: 'Rp 27 T', pe: 11.2, pbv: 0.7, roe: 6.8, div: 4.8, margin: 7.2 },
    { symbol: 'EXCL', name: 'XL Axiata Tbk', price: 2240, change: 0.90, mcap: 'Rp 29 T', pe: 18.4, pbv: 1.1, roe: 6.2, div: 2.8, margin: 4.8 },
    { symbol: 'ISAT', name: 'Indosat Ooredoo Hutchison', price: 10450, change: 1.45, mcap: 'Rp 84 T', pe: 16.8, pbv: 2.8, roe: 16.8, div: 3.2, margin: 9.8 },
    { symbol: 'MEDC', name: 'Medco Energi Internasional', price: 1310, change: 2.75, mcap: 'Rp 33 T', pe: 5.4, pbv: 1.0, roe: 18.5, div: 3.8, margin: 15.2 },
    { symbol: 'MBMA', name: 'Merdeka Battery Materials', price: 540, change: 3.85, mcap: 'Rp 58 T', pe: 120.0, pbv: 2.8, roe: 2.4, div: 0.0, margin: 3.1 },
    { symbol: 'NCKL', name: 'Trimegah Bangun Persada', price: 920, change: 1.65, mcap: 'Rp 58 T', pe: 10.2, pbv: 1.8, roe: 18.2, div: 5.4, margin: 24.5 },
    { symbol: 'ITMG', name: 'Indo Tambangraya Megah', price: 26150, change: 0.48, mcap: 'Rp 29 T', pe: 5.2, pbv: 1.2, roe: 24.8, div: 18.5, margin: 22.4 },
    { symbol: 'BRPT', name: 'Barito Pacific Tbk', price: 1140, change: -1.30, mcap: 'Rp 106 T', pe: 140.0, pbv: 4.2, roe: 3.1, div: 0.1, margin: 2.8 },
    { symbol: 'MYOR', name: 'Mayora Indah Tbk', price: 2450, change: 0.82, mcap: 'Rp 54 T', pe: 16.4, pbv: 3.2, roe: 19.8, div: 2.2, margin: 9.8 },
    { symbol: 'ACES', name: 'Ace Hardware Indonesia', price: 820, change: -0.61, mcap: 'Rp 14 T', pe: 16.8, pbv: 2.4, roe: 14.8, div: 3.8, margin: 10.4 },
    { symbol: 'SMRA', name: 'Summarecon Agung Tbk', price: 560, change: 1.82, mcap: 'Rp 9 T', pe: 12.4, pbv: 0.9, roe: 7.8, div: 1.8, margin: 12.8 },
    { symbol: 'CTRA', name: 'Ciputra Development Tbk', price: 1280, change: 0.78, mcap: 'Rp 23 T', pe: 11.8, pbv: 1.1, roe: 9.8, div: 2.1, margin: 18.2 },
  ];

  async getAssets(): Promise<Asset[]> {
    const nowStr = new Date().toLocaleTimeString();
    return this.idxAssets.map(item => {
      const sparkline: number[] = [];
      for (let i = 0; i < 10; i++) {
        sparkline.push(Number((item.price * (1 + (Math.sin(i) * item.change) / 100)).toFixed(0)));
      }

      return {
        id: item.symbol.toLowerCase(),
        symbol: item.symbol,
        name: item.name,
        category: 'idx_stocks',
        price: item.price,
        change24h: item.change,
        high24h: Math.round(item.price * 1.02),
        low24h: Math.round(item.price * 0.98),
        volume24h: 125000000000,
        sparkline,
        baseSource: 'idx',
        currency: 'IDR',
        lastUpdated: nowStr,
        micro: {
          marketCap: item.mcap,
          peRatio: item.pe,
          pbvRatio: item.pbv,
          roe: item.roe,
          dividendYield: item.div,
          netProfitMargin: item.margin,
          earningsGrowth: item.change > 0 ? 12.4 : -3.2,
          bidAskSpread: 0.05,
          orderBookPressure: item.change > 1.0 ? 'BUY_DOMINANT' : item.change < -1.0 ? 'SELL_DOMINANT' : 'NEUTRAL',
          liquidityScore: 90,
          microTrendSignal: item.change > 2.0 ? 'BREAKOUT' : item.change > 0 ? 'ACCUMULATION' : 'DISTRIBUTION'
        }
      };
    });
  }

  async getTicker(symbol: string): Promise<Asset | null> {
    const clean = symbol.toUpperCase().replace('.JK', '');
    const found = this.idxAssets.find(a => a.symbol === clean);
    if (!found) return null;

    const assets = await this.getAssets();
    return assets.find(a => a.symbol === clean) || null;
  }

  async getKlines(symbol: string, interval: string = '1d', limit: number = 60): Promise<Kline[]> {
    const clean = symbol.toUpperCase().replace('.JK', '');
    return this.yahooFallback.getKlines(`${clean}.JK`, interval, limit);
  }
}
