import { DataAdapter } from './base-adapter';
import { Asset, Kline } from '../../src/types';

export class ForexAdapter implements DataAdapter {
  name = 'exchangerate';

  private forexPairs = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0865, change: 0.15, mcap: '$7.5T Daily Vol' },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2940, change: -0.22, mcap: '$3.2T Daily Vol' },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 154.20, change: 0.45, mcap: '$4.1T Daily Vol' },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.6580, change: 0.32, mcap: '$1.8T Daily Vol' },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.3650, change: -0.12, mcap: '$1.4T Daily Vol' },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', price: 0.8840, change: -0.10, mcap: '$1.1T Daily Vol' },
    { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', price: 0.6020, change: 0.28, mcap: '$0.8T Daily Vol' },
    { symbol: 'USD/IDR', name: 'US Dollar / Indonesian Rupiah', price: 16240, change: 0.18, mcap: 'Bank Indonesia Reserve $140B' },
    { symbol: 'EUR/IDR', name: 'Euro / Indonesian Rupiah', price: 17645, change: 0.25, mcap: 'Macro Trade Corridor' },
    { symbol: 'GBP/IDR', name: 'British Pound / Indonesian Rupiah', price: 21015, change: -0.08, mcap: 'Macro Trade Corridor' },
    { symbol: 'AUD/IDR', name: 'Australian Dollar / IDR', price: 10680, change: 0.42, mcap: 'Macro Trade Corridor' },
    { symbol: 'SGD/IDR', name: 'Singapore Dollar / IDR', price: 12150, change: 0.12, mcap: 'ASEAN FX Corridor' },
    { symbol: 'JPY/IDR', name: 'Japanese Yen / IDR (100 JPY)', price: 10520, change: -0.28, mcap: 'Asia FX Corridor' },
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', price: 0.8395, change: 0.38, mcap: 'European FX Cross' },
    { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', price: 167.55, change: 0.62, mcap: 'G10 FX Cross' },
    { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', price: 199.60, change: 0.22, mcap: 'G10 FX Cross' },
    { symbol: 'XAU/USD', name: 'Gold Spot / US Dollar', price: 2420.50, change: 0.85, mcap: '$16.2T Market Cap' },
    { symbol: 'XAG/USD', name: 'Silver Spot / US Dollar', price: 28.40, change: 1.45, mcap: '$1.4T Market Cap' },
    { symbol: 'WTI/USD', name: 'Crude Oil WTI', price: 78.50, change: -1.20, mcap: 'OPEC+ Supply 42M bpd' },
    { symbol: 'BRENT/USD', name: 'Brent Crude Oil', price: 82.10, change: -0.95, mcap: 'Global Oil Benchmark' },
    { symbol: 'NG/USD', name: 'Natural Gas Spot', price: 2.15, change: 2.10, mcap: 'Henry Hub Energy' },
    { symbol: 'COPPER/USD', name: 'Copper Spot', price: 4.25, change: 0.90, mcap: 'Industrial Macro Indicator' },
    { symbol: 'PLAT/USD', name: 'Platinum Spot', price: 965.00, change: 0.40, mcap: 'Precious Metals' },
    { symbol: 'WHEAT/USD', name: 'Wheat Commodities Spot', price: 540.50, change: -0.45, mcap: 'Global Grain Futures' },
    { symbol: 'CORN/USD', name: 'Corn Commodities Spot', price: 412.00, change: 0.35, mcap: 'CBOT Agri Futures' },
  ];

  async getAssets(): Promise<Asset[]> {
    try {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (res.ok) {
        const data = await res.json() as { rates: Record<string, number> };
        const rates = data.rates;
        
        const eur = rates['EUR'] ? 1 / rates['EUR'] : 1.0865;
        const gbp = rates['GBP'] ? 1 / rates['GBP'] : 1.2940;
        const jpy = rates['JPY'] || 154.20;
        const aud = rates['AUD'] ? 1 / rates['AUD'] : 0.6580;
        const cad = rates['CAD'] || 1.3650;
        const chf = rates['CHF'] || 0.8840;
        const idr = rates['IDR'] || 16240;

        if (this.forexPairs[0]) this.forexPairs[0].price = Number(eur.toFixed(4));
        if (this.forexPairs[1]) this.forexPairs[1].price = Number(gbp.toFixed(4));
        if (this.forexPairs[2]) this.forexPairs[2].price = Number(jpy.toFixed(2));
        if (this.forexPairs[3]) this.forexPairs[3].price = Number(aud.toFixed(4));
        if (this.forexPairs[4]) this.forexPairs[4].price = Number(cad.toFixed(4));
        if (this.forexPairs[5]) this.forexPairs[5].price = Number(chf.toFixed(4));
        if (this.forexPairs[7]) this.forexPairs[7].price = Number(idr.toFixed(0));
        if (this.forexPairs[8]) this.forexPairs[8].price = Number((eur * idr).toFixed(0));
        if (this.forexPairs[9]) this.forexPairs[9].price = Number((gbp * idr).toFixed(0));
      }
    } catch (e) {
      // Fallback
    }

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return this.forexPairs.map(p => {
      const sparkline: number[] = [];
      for (let i = 0; i < 8; i++) {
        sparkline.push(Number((p.price * (1 + Math.sin(i) * 0.003)).toFixed(p.price > 100 ? 2 : 4)));
      }

      return {
        id: p.symbol.toLowerCase().replace('/', ''),
        symbol: p.symbol,
        name: p.name,
        category: 'forex',
        price: p.price,
        change24h: p.change,
        high24h: Number((p.price * 1.006).toFixed(p.price > 100 ? 2 : 4)),
        low24h: Number((p.price * 0.994).toFixed(p.price > 100 ? 2 : 4)),
        volume24h: 450000000000,
        sparkline,
        baseSource: 'exchangerate',
        currency: p.symbol.endsWith('IDR') ? 'IDR' : p.symbol.endsWith('JPY') ? 'JPY' : 'USD',
        lastUpdated: nowStr,
        micro: {
          marketCap: p.mcap,
          peRatio: 0,
          pbvRatio: 0,
          roe: 0,
          dividendYield: 0,
          netProfitMargin: 0,
          earningsGrowth: 0,
          bidAskSpread: 0.0002,
          orderBookPressure: p.change > 0.2 ? 'BUY_DOMINANT' : p.change < -0.2 ? 'SELL_DOMINANT' : 'NEUTRAL',
          liquidityScore: 98,
          microTrendSignal: p.change > 0.5 ? 'BREAKOUT' : p.change > 0 ? 'ACCUMULATION' : 'DISTRIBUTION'
        }
      };
    });
  }

  async getTicker(symbol: string): Promise<Asset | null> {
    const clean = symbol.toUpperCase().replace('/', '');
    const assets = await this.getAssets();
    return assets.find(a => a.symbol.replace('/', '').toUpperCase() === clean) || null;
  }

  async getKlines(symbol: string, interval: string = '1h', limit: number = 60): Promise<Kline[]> {
    const clean = symbol.toUpperCase();
    const pair = this.forexPairs.find(p => p.symbol === clean || p.symbol.replace('/', '') === clean) || this.forexPairs[0];
    const now = Date.now();
    const klines: Kline[] = [];
    let price = pair.price;

    for (let i = limit; i >= 0; i--) {
      const timestamp = now - i * 3600 * 1000;
      const variation = (Math.sin(i * 0.3) * 0.0012 + Math.cos(i * 0.2) * 0.0008) * price;
      const open = price;
      const close = price + variation;
      const high = Math.max(open, close) + Math.abs(variation) * 0.5;
      const low = Math.min(open, close) - Math.abs(variation) * 0.5;

      klines.push({
        timestamp,
        open: Number(open.toFixed(4)),
        high: Number(high.toFixed(4)),
        low: Number(low.toFixed(4)),
        close: Number(close.toFixed(4)),
        volume: Math.floor(Math.abs(variation * 100000000) + 50000),
        dateStr: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      price = close;
    }

    return klines;
  }
}
