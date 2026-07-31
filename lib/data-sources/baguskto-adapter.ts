import { DataAdapter } from './base-adapter';
import { Asset, Kline } from '../../src/types';
import { YahooFinanceAdapter } from './yahoo-adapter';

export class BagusktoSahamAdapter implements DataAdapter {
  name = 'idx';
  private yahooFallback = new YahooFinanceAdapter();

  private idxAssets = [
    // Perbankan & Keuangan (Banking & Financials)
    { symbol: 'BBCA', name: 'Bank Central Asia Tbk', price: 10425, change: 1.22, mcap: 'Rp 1.285 T', pe: 24.8, pbv: 4.8, roe: 21.5, div: 2.8, margin: 42.5 },
    { symbol: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', price: 4890, change: 2.08, mcap: 'Rp 741 T', pe: 12.4, pbv: 2.2, roe: 18.2, div: 6.8, margin: 31.2 },
    { symbol: 'BMRI', name: 'Bank Mandiri Tbk', price: 7150, change: 1.78, mcap: 'Rp 667 T', pe: 11.8, pbv: 2.1, roe: 19.8, div: 5.4, margin: 34.5 },
    { symbol: 'BBNI', name: 'Bank Negara Indonesia Tbk', price: 5450, change: 0.93, mcap: 'Rp 203 T', pe: 9.8, pbv: 1.2, roe: 14.5, div: 5.2, margin: 28.4 },
    { symbol: 'BBTN', name: 'Bank Tabungan Negara Tbk', price: 1380, change: 1.47, mcap: 'Rp 19 T', pe: 5.8, pbv: 0.6, roe: 10.4, div: 4.8, margin: 15.2 },
    { symbol: 'BDMN', name: 'Bank Danamon Indonesia Tbk', price: 2710, change: 0.37, mcap: 'Rp 26 T', pe: 7.8, pbv: 0.5, roe: 7.2, div: 5.1, margin: 18.4 },
    { symbol: 'BRIS', name: 'Bank Syariah Indonesia Tbk', price: 2840, change: 3.65, mcap: 'Rp 131 T', pe: 21.4, pbv: 3.2, roe: 16.8, div: 1.8, margin: 24.1 },
    { symbol: 'BNGA', name: 'Bank CIMB Niaga Tbk', price: 1820, change: 0.55, mcap: 'Rp 45 T', pe: 6.8, pbv: 0.8, roe: 13.5, div: 6.8, margin: 26.2 },
    { symbol: 'ARTO', name: 'Bank Jago Tbk', price: 2680, change: 4.28, mcap: 'Rp 37 T', pe: 140.0, pbv: 4.5, roe: 2.1, div: 0.0, margin: 8.5 },
    { symbol: 'BBHI', name: 'Allo Bank Indonesia Tbk', price: 1020, change: -1.45, mcap: 'Rp 22 T', pe: 42.5, pbv: 3.1, roe: 7.4, div: 0.0, margin: 12.8 },

    // Teknologi, Media & E-Commerce
    { symbol: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', price: 68, change: 3.03, mcap: 'Rp 81 T', pe: -12.4, pbv: 0.8, roe: -8.2, div: 0.0, margin: -12.5 },
    { symbol: 'BUKA', name: 'PT Bukalapak.com Tbk', price: 132, change: 1.54, mcap: 'Rp 13.6 T', pe: -18.2, pbv: 0.5, roe: -2.8, div: 0.0, margin: -5.4 },
    { symbol: 'EMTK', name: 'Elang Mahkota Teknologi Tbk', price: 435, change: 2.35, mcap: 'Rp 26.5 T', pe: 28.4, pbv: 0.9, roe: 3.2, div: 1.2, margin: 6.8 },
    { symbol: 'SCMA', name: 'Surya Citra Media Tbk', price: 142, change: -0.70, mcap: 'Rp 10.5 T', pe: 14.2, pbv: 1.2, roe: 8.4, div: 3.5, margin: 12.1 },
    { symbol: 'BELI', name: 'Global Digital Niaga (Blibli)', price: 460, change: 0.00, mcap: 'Rp 54.5 T', pe: -22.1, pbv: 3.8, roe: -15.2, div: 0.0, margin: -8.4 },

    // Telekomunikasi & Menara
    { symbol: 'TLKM', name: 'Telkom Indonesia Tbk', price: 2950, change: -0.67, mcap: 'Rp 292 T', pe: 12.2, pbv: 2.1, roe: 16.8, div: 6.2, margin: 18.2 },
    { symbol: 'ISAT', name: 'Indosat Ooredoo Hutchison', price: 10450, change: 1.45, mcap: 'Rp 84 T', pe: 16.8, pbv: 2.8, roe: 16.8, div: 3.2, margin: 9.8 },
    { symbol: 'EXCL', name: 'XL Axiata Tbk', price: 2240, change: 0.90, mcap: 'Rp 29 T', pe: 18.4, pbv: 1.1, roe: 6.2, div: 2.8, margin: 4.8 },
    { symbol: 'TOWR', name: 'Sarana Menara Nusantara Tbk', price: 815, change: 1.24, mcap: 'Rp 41.5 T', pe: 12.5, pbv: 2.4, roe: 19.2, div: 3.4, margin: 28.5 },
    { symbol: 'TBIG', name: 'Tower Bersama Infrastructure', price: 1820, change: -0.55, mcap: 'Rp 41.2 T', pe: 26.4, pbv: 3.8, roe: 14.5, div: 2.1, margin: 32.1 },

    // Pertambangan, Energi & Energi Terbarukan
    { symbol: 'AMMN', name: 'Amman Mineral Internasional', price: 11850, change: 4.22, mcap: 'Rp 858 T', pe: 48.5, pbv: 8.4, roe: 22.4, div: 0.0, margin: 28.5 },
    { symbol: 'ADRO', name: 'Adaro Energy Indonesia Tbk', price: 3650, change: 1.82, mcap: 'Rp 112 T', pe: 4.2, pbv: 0.9, roe: 24.8, div: 14.2, margin: 28.2 },
    { symbol: 'BREN', name: 'Barito Renewables Energy', price: 8950, change: 2.88, mcap: 'Rp 1.197 T', pe: 420.0, pbv: 112.0, roe: 38.5, div: 0.2, margin: 38.2 },
    { symbol: 'TPIA', name: 'Chandra Asri Petrochemical', price: 9425, change: -0.52, mcap: 'Rp 815 T', pe: 180.2, pbv: 18.4, roe: 2.8, div: 0.0, margin: 2.1 },
    { symbol: 'PTBA', name: 'Bukit Asam Tbk', price: 2720, change: 0.74, mcap: 'Rp 31 T', pe: 5.8, pbv: 1.4, roe: 28.2, div: 15.8, margin: 18.4 },
    { symbol: 'ANTM', name: 'Aneka Tambang Tbk', price: 1540, change: 1.32, mcap: 'Rp 37 T', pe: 12.8, pbv: 1.5, roe: 13.4, div: 6.2, margin: 8.5 },
    { symbol: 'INCO', name: 'Vale Indonesia Tbk', price: 3920, change: -1.26, mcap: 'Rp 38.9 T', pe: 14.2, pbv: 1.1, roe: 8.2, div: 3.5, margin: 16.8 },
    { symbol: 'HRUM', name: 'Harum Energy Tbk', price: 1320, change: 1.15, mcap: 'Rp 17 T', pe: 6.2, pbv: 0.9, roe: 18.4, div: 8.2, margin: 22.4 },
    { symbol: 'MDKA', name: 'Merdeka Copper Gold Tbk', price: 2380, change: 2.15, mcap: 'Rp 57 T', pe: 88.2, pbv: 3.2, roe: 3.8, div: 0.0, margin: 4.2 },
    { symbol: 'MEDC', name: 'Medco Energi Internasional', price: 1310, change: 2.75, mcap: 'Rp 33 T', pe: 5.4, pbv: 1.0, roe: 18.5, div: 3.8, margin: 15.2 },
    { symbol: 'MBMA', name: 'Merdeka Battery Materials', price: 540, change: 3.85, mcap: 'Rp 58 T', pe: 120.0, pbv: 2.8, roe: 2.4, div: 0.0, margin: 3.1 },
    { symbol: 'NCKL', name: 'Trimegah Bangun Persada', price: 920, change: 1.65, mcap: 'Rp 58 T', pe: 10.2, pbv: 1.8, roe: 18.2, div: 5.4, margin: 24.5 },
    { symbol: 'ITMG', name: 'Indo Tambangraya Megah', price: 26150, change: 0.48, mcap: 'Rp 29 T', pe: 5.2, pbv: 1.2, roe: 24.8, div: 18.5, margin: 22.4 },
    { symbol: 'BRPT', name: 'Barito Pacific Tbk', price: 1140, change: -1.30, mcap: 'Rp 106 T', pe: 140.0, pbv: 4.2, roe: 3.1, div: 0.1, margin: 2.8 },
    { symbol: 'PGAS', name: 'Perusahaan Gas Negara Tbk', price: 1585, change: 2.26, mcap: 'Rp 38 T', pe: 7.2, pbv: 0.8, roe: 11.8, div: 9.4, margin: 8.2 },
    { symbol: 'AKRA', name: 'AKR Corporindo Tbk', price: 1520, change: 0.66, mcap: 'Rp 30.5 T', pe: 10.8, pbv: 2.1, roe: 19.5, div: 5.8, margin: 7.2 },
    { symbol: 'CUAN', name: 'Petrindo Jaya Kreasi Tbk', price: 8350, change: 5.03, mcap: 'Rp 93.8 T', pe: 210.0, pbv: 45.0, roe: 21.5, div: 0.0, margin: 18.2 },
    { symbol: 'PGEO', name: 'Pertamina Geothermal Energy', price: 1210, change: 1.68, mcap: 'Rp 50.2 T', pe: 18.2, pbv: 1.8, roe: 9.8, div: 2.8, margin: 38.5 },

    // Konsumer, Ritel, Farmasi & Otomotif
    { symbol: 'ASII', name: 'Astra International Tbk', price: 5125, change: -1.44, mcap: 'Rp 207 T', pe: 6.8, pbv: 1.0, roe: 15.2, div: 8.5, margin: 10.4 },
    { symbol: 'UNVR', name: 'Unilever Indonesia Tbk', price: 2280, change: 0.44, mcap: 'Rp 87 T', pe: 18.4, pbv: 22.5, roe: 88.5, div: 4.8, margin: 14.2 },
    { symbol: 'ICBP', name: 'Indofood CBP Sukses Makmur', price: 11200, change: 0.45, mcap: 'Rp 130 T', pe: 14.8, pbv: 3.1, roe: 21.4, div: 3.2, margin: 12.8 },
    { symbol: 'INDF', name: 'Indofood Sukses Makmur Tbk', price: 6850, change: -0.36, mcap: 'Rp 60 T', pe: 6.8, pbv: 1.1, roe: 16.5, div: 4.8, margin: 8.4 },
    { symbol: 'CPIN', name: 'Charoen Pokphand Indonesia', price: 5125, change: 0.98, mcap: 'Rp 84 T', pe: 24.2, pbv: 2.8, roe: 12.4, div: 2.2, margin: 4.8 },
    { symbol: 'JPFA', name: 'Japfa Comfeed Indonesia Tbk', price: 1580, change: 2.60, mcap: 'Rp 18.5 T', pe: 11.2, pbv: 1.3, roe: 12.1, div: 3.2, margin: 5.4 },
    { symbol: 'KLBF', name: 'Kalbe Farma Tbk', price: 1640, change: -0.61, mcap: 'Rp 76 T', pe: 22.8, pbv: 3.4, roe: 15.2, div: 2.4, margin: 10.8 },
    { symbol: 'MYOR', name: 'Mayora Indah Tbk', price: 2450, change: 0.82, mcap: 'Rp 54 T', pe: 16.4, pbv: 3.2, roe: 19.8, div: 2.2, margin: 9.8 },
    { symbol: 'SIDO', name: 'Industri Jamu Sido Muncul', price: 685, change: 1.48, mcap: 'Rp 20.5 T', pe: 18.5, pbv: 5.8, roe: 31.2, div: 5.4, margin: 28.5 },
    { symbol: 'ACES', name: 'Ace Hardware Indonesia', price: 820, change: -0.61, mcap: 'Rp 14 T', pe: 16.8, pbv: 2.4, roe: 14.8, div: 3.8, margin: 10.4 },
    { symbol: 'AMRT', name: 'Sumber Alfaria Trijaya Tbk', price: 2890, change: 0.70, mcap: 'Rp 120 T', pe: 34.2, pbv: 9.2, roe: 28.4, div: 1.2, margin: 3.2 },

    // Semen, Kertas, Konstruksi & Properti
    { symbol: 'SMGR', name: 'Semen Indonesia Tbk', price: 3950, change: 1.28, mcap: 'Rp 27 T', pe: 11.2, pbv: 0.7, roe: 6.8, div: 4.8, margin: 7.2 },
    { symbol: 'INKP', name: 'Indah Kiat Pulp & Paper', price: 8250, change: -0.90, mcap: 'Rp 45 T', pe: 6.4, pbv: 0.5, roe: 8.2, div: 2.4, margin: 14.8 },
    { symbol: 'TKIM', name: 'Pabrik Kertas Tjiwi Kimia', price: 7425, change: -0.67, mcap: 'Rp 23 T', pe: 5.8, pbv: 0.4, roe: 7.4, div: 2.1, margin: 12.4 },
    { symbol: 'CTRA', name: 'Ciputra Development Tbk', price: 1280, change: 0.78, mcap: 'Rp 23 T', pe: 11.8, pbv: 1.1, roe: 9.8, div: 2.1, margin: 18.2 },
    { symbol: 'SMRA', name: 'Summarecon Agung Tbk', price: 560, change: 1.82, mcap: 'Rp 9 T', pe: 12.4, pbv: 0.9, roe: 7.8, div: 1.8, margin: 12.8 },
    { symbol: 'BSDE', name: 'Bumi Serpong Damai Tbk', price: 1080, change: 1.41, mcap: 'Rp 22.8 T', pe: 8.5, pbv: 0.6, roe: 7.2, div: 1.5, margin: 24.1 },
    { symbol: 'PWON', name: 'Pakuwon Jati Tbk', price: 445, change: 0.91, mcap: 'Rp 21.4 T', pe: 9.8, pbv: 1.1, roe: 11.2, div: 2.1, margin: 35.2 }
  ];

  async getAssets(): Promise<Asset[]> {
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Construct Yahoo tickers for IDX stocks (e.g., BBCA.JK, BBRI.JK, BMRI.JK, etc.)
    const jkSymbols = this.idxAssets.map(item => `${item.symbol}.JK`).join(',');

    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(jkSymbols)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });

      if (res.ok) {
        const json = await res.json() as { quoteResponse?: { result?: Array<any> } };
        const results = json.quoteResponse?.result || [];

        if (results.length > 0) {
          return this.idxAssets.map(item => {
            const raw = results.find((r: any) => r.symbol === `${item.symbol}.JK` || r.symbol === item.symbol);
            
            const price = raw?.regularMarketPrice || raw?.postMarketPrice || item.price;
            const change24h = raw?.regularMarketChangePercent != null 
              ? Number(raw.regularMarketChangePercent.toFixed(2)) 
              : item.change;
            
            const high24h = raw?.regularMarketDayHigh || Math.round(price * 1.02);
            const low24h = raw?.regularMarketDayLow || Math.round(price * 0.98);
            const volume24h = raw?.regularMarketVolume || 125000000000;

            const sparkline: number[] = [
              Math.round(price * (1 - (change24h / 100))),
              Math.round(price * 0.995),
              Math.round(price * 1.005),
              Math.round(price)
            ];

            return {
              id: item.symbol.toLowerCase(),
              symbol: item.symbol,
              name: item.name,
              category: 'idx_stocks',
              price,
              change24h,
              high24h,
              low24h,
              volume24h,
              sparkline,
              baseSource: 'idx',
              currency: 'IDR',
              lastUpdated: nowStr,
              micro: {
                marketCap: item.mcap,
                peRatio: raw?.trailingPE ? Number(raw.trailingPE.toFixed(1)) : item.pe,
                pbvRatio: raw?.priceToBook ? Number(raw.priceToBook.toFixed(1)) : item.pbv,
                roe: item.roe,
                dividendYield: raw?.trailingAnnualDividendYield ? Number((raw.trailingAnnualDividendYield * 100).toFixed(2)) : item.div,
                netProfitMargin: item.margin,
                earningsGrowth: change24h > 0 ? 12.4 : -3.2,
                bidAskSpread: 0.05,
                orderBookPressure: change24h > 1.0 ? 'BUY_DOMINANT' : change24h < -1.0 ? 'SELL_DOMINANT' : 'NEUTRAL',
                liquidityScore: 92,
                microTrendSignal: change24h > 2.0 ? 'BREAKOUT' : change24h > 0 ? 'ACCUMULATION' : 'DISTRIBUTION'
              }
            };
          });
        }
      }
    } catch (err) {
      console.warn('IDX Yahoo live quote fetch failed, falling back to cached baseline:', err);
    }

    // Fallback if network blocked
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
