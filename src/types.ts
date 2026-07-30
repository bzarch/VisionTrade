export type AssetCategory = 'crypto' | 'global_stocks' | 'idx_stocks' | 'forex';

export type DataSource = 'binance' | 'coingecko' | 'yahoo' | 'idx' | 'exchangerate' | 'worldbank';

export interface MicroFundamentals {
  marketCap: string;
  peRatio: number;
  pbvRatio: number;
  roe: number;
  dividendYield: number;
  netProfitMargin: number;
  earningsGrowth: number;
  bidAskSpread: number;
  orderBookPressure: 'BUY_DOMINANT' | 'SELL_DOMINANT' | 'NEUTRAL';
  liquidityScore: number;
  microTrendSignal: 'ACCUMULATION' | 'DISTRIBUTION' | 'CONSOLIDATION' | 'BREAKOUT';
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
  baseSource: DataSource;
  currency: string;
  lastUpdated: string;
  micro?: MicroFundamentals;
}

export interface Kline {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  dateStr?: string;
}

export interface IndicatorValues {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  sma: {
    sma20: number;
    sma50: number;
    sma200: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
    percentB: number;
  };
  volumeRatio: number; // Current volume vs 20-period average
}

export type SignalType = 'BUY' | 'SELL' | 'HOLD';

export interface ConfluenceResult {
  score: number; // 0 to 100
  signal: SignalType;
  reasons: string[];
  breakdown: {
    rsiScore: number;
    macdScore: number;
    smaScore: number;
    volumeScore: number;
  };
}

export interface AgentSignal {
  agentName: 'Technical AI' | 'Sentiment AI' | 'Macro AI';
  signal: SignalType;
  confidence: number; // 0-100
  reasoning: string;
  impactScore?: number;
  sentimentScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  keyEvents?: string[];
}

export interface CombinedAISignal {
  finalSignal: SignalType;
  confidenceScore: number;
  technicalAgent: AgentSignal;
  sentimentAgent: AgentSignal;
  macroAgent: AgentSignal;
  confluenceWeight: {
    technical: number; // 50%
    sentiment: number; // 30%
    macro: number;     // 20%
  };
  timestamp: string;
  modelUsed: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  sentimentScore: number; // -1.0 to +1.0
  impactCategory: string;
}

export interface MacroIndicator {
  indicator: string;
  country: string;
  value: number;
  unit: string;
  previousValue: number;
  lastUpdated: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

export interface PortfolioPosition {
  id: string;
  symbol: string;
  assetName: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  createdAt: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
