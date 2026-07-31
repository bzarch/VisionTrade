import { create } from 'zustand';
import {
  Asset,
  AssetCategory,
  DataSource,
  Kline,
  IndicatorValues,
  ConfluenceResult,
  CombinedAISignal,
  NewsItem,
  MacroIndicator,
  PortfolioPosition,
  PriceAlert,
  ChatMessage
} from '../types';

interface MarketStoreState {
  assets: Asset[];
  activeAsset: Asset | null;
  activeCategory: AssetCategory;
  activeSource: DataSource;
  klines: Kline[];
  timeframe: string;
  indicators: IndicatorValues | null;
  confluence: ConfluenceResult | null;
  aiSignal: CombinedAISignal | null;
  news: NewsItem[];
  macroData: MacroIndicator[];
  aiInsights: string[];
  portfolio: PortfolioPosition[];
  alerts: PriceAlert[];
  chatMessages: ChatMessage[];
  isAiLoading: boolean;
  isDataLoading: boolean;
  searchQuery: string;
  activeTab: 'overview' | 'grid' | 'portfolio' | 'news' | 'calculator' | 'heatmap' | 'calendar' | 'screener' | 'alerts';

  setCategory: (category: AssetCategory) => void;
  setSource: (source: DataSource) => void;
  setActiveAsset: (asset: Asset) => void;
  setTimeframe: (tf: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: 'overview' | 'grid' | 'portfolio' | 'news' | 'calculator' | 'heatmap' | 'calendar' | 'screener' | 'alerts') => void;

  fetchMarketData: (isSilent?: boolean) => Promise<void>;
  fetchKlinesAndIndicators: (symbol: string) => Promise<void>;
  fetchAISignal: (symbol: string, price: number) => Promise<void>;
  fetchAIInsights: (symbol: string) => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;

  addPortfolioTrade: (type: 'BUY' | 'SELL', amount: number) => void;
  closePortfolioTrade: (id: string) => void;
  addPriceAlert: (targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  removePriceAlert: (id: string) => void;
}

export const useMarketStore = create<MarketStoreState>((set, get) => ({
  assets: [],
  activeAsset: null,
  activeCategory: 'crypto',
  activeSource: 'binance',
  klines: [],
  timeframe: '1h',
  indicators: null,
  confluence: null,
  aiSignal: null,
  news: [],
  macroData: [],
  aiInsights: [],
  portfolio: [
    {
      id: 'trade_1',
      symbol: 'BTC/USDT',
      assetName: 'Bitcoin',
      type: 'BUY',
      entryPrice: 91400.00,
      currentPrice: 94850.50,
      amount: 0.15,
      pnl: 517.58,
      pnlPercent: 3.77,
      timestamp: '2026-07-29 14:20'
    },
    {
      id: 'trade_2',
      symbol: 'BBCA',
      assetName: 'Bank Central Asia',
      type: 'BUY',
      entryPrice: 10100.00,
      currentPrice: 10425.00,
      amount: 500,
      pnl: 162500,
      pnlPercent: 3.22,
      timestamp: '2026-07-28 09:30'
    }
  ],
  alerts: [
    {
      id: 'alert_1',
      symbol: 'BTC/USDT',
      targetPrice: 96000,
      condition: 'ABOVE',
      createdAt: '2026-07-29 10:00',
      active: true
    }
  ],
  chatMessages: [
    {
      id: 'msg_init',
      sender: 'assistant',
      text: 'Selamat datang di VisionTrade Pro AI Assistant (Powered by Google Gemini 3.6 Flash). Silakan tanyakan analisis teknikal, sentimen pasar, atau pertimbangkan posisi trading untuk aset Anda.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  isAiLoading: false,
  isDataLoading: false,
  searchQuery: '',
  activeTab: 'overview',

  setCategory: (category) => {
    set({ activeCategory: category });
    const currentAssets = get().assets;
    const filtered = currentAssets.filter(a => a.category === category);
    if (filtered.length > 0) {
      get().setActiveAsset(filtered[0]);
    }
  },

  setSource: (source) => {
    set({ activeSource: source });
    get().fetchMarketData();
  },

  setActiveAsset: (asset) => {
    set({ activeAsset: asset });
    get().fetchKlinesAndIndicators(asset.symbol);
    get().fetchAISignal(asset.symbol, asset.price);
    get().fetchAIInsights(asset.symbol);
  },

  setTimeframe: (tf) => {
    set({ timeframe: tf });
    const active = get().activeAsset;
    if (active) {
      get().fetchKlinesAndIndicators(active.symbol);
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchMarketData: async (isSilent = false) => {
    if (!isSilent) set({ isDataLoading: true });
    try {
      const { activeSource, alerts } = get();
      const res = await fetch(`/api/market?source=${activeSource}`);
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        set({ assets: json.data });
        
        const currentActive = get().activeAsset;
        if (!currentActive) {
          get().setActiveAsset(json.data[0]);
        } else {
          // Update current active asset price seamlessly
          const updatedActive = json.data.find((a: Asset) => a.symbol === currentActive.symbol || a.id === currentActive.id);
          if (updatedActive) {
            set({ activeAsset: { ...currentActive, price: updatedActive.price, change24h: updatedActive.change24h, high24h: updatedActive.high24h, low24h: updatedActive.low24h, lastUpdated: updatedActive.lastUpdated } });
          }
        }

        // Check active price alerts against live prices
        if (alerts.length > 0) {
          json.data.forEach((asset: Asset) => {
            alerts.forEach((alt) => {
              if (alt.active && (alt.symbol === asset.symbol || alt.symbol === asset.id)) {
                if (alt.condition === 'ABOVE' && asset.price >= alt.targetPrice) {
                  console.log(`[ALERT TRIGGERED] ${asset.symbol} reached ${asset.price} (Above ${alt.targetPrice})`);
                } else if (alt.condition === 'BELOW' && asset.price <= alt.targetPrice) {
                  console.log(`[ALERT TRIGGERED] ${asset.symbol} dropped to ${asset.price} (Below ${alt.targetPrice})`);
                }
              }
            });
          });
        }
      }
    } catch (err) {
      console.error('Fetch market error:', err);
    } finally {
      if (!isSilent) set({ isDataLoading: false });
    }
  },

  fetchKlinesAndIndicators: async (symbol) => {
    try {
      const { timeframe } = get();
      const [klinesRes, indRes] = await Promise.all([
        fetch(`/api/klines?symbol=${encodeURIComponent(symbol)}&interval=${timeframe}&limit=60`),
        fetch(`/api/indicators?symbol=${encodeURIComponent(symbol)}&interval=${timeframe}`)
      ]);

      const klinesJson = await klinesRes.json();
      const indJson = await indRes.json();

      if (klinesJson.status === 'success') {
        set({ klines: klinesJson.data });
      }

      if (indJson.status === 'success') {
        set({
          indicators: indJson.indicators,
          confluence: indJson.confluence
        });
      }
    } catch (err) {
      console.error('Fetch klines error:', err);
    }
  },

  fetchAISignal: async (symbol, price) => {
    set({ isAiLoading: true });
    try {
      const res = await fetch('/api/ai/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, price })
      });
      const json = await res.json();
      if (json.status === 'success') {
        set({ aiSignal: json.data });
      }
    } catch (err) {
      console.error('Fetch AI signal error:', err);
    } finally {
      set({ isAiLoading: false });
    }
  },

  fetchAIInsights: async (symbol) => {
    try {
      const res = await fetch(`/api/ai/insights?symbol=${encodeURIComponent(symbol)}`);
      const json = await res.json();
      if (json.status === 'success') {
        set({ aiInsights: json.insights });
      }
    } catch (err) {
      console.error('Fetch AI insights error:', err);
    }
  },

  sendChatMessage: async (text) => {
    const active = get().activeAsset;
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set(state => ({ chatMessages: [...state.chatMessages, userMsg] }));

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeSymbol: active?.symbol || 'BTC/USDT'
        })
      });
      const json = await res.json();

      const aiReply: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        text: json.reply || 'Maaf, ada kendala pemrosesan.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      set(state => ({ chatMessages: [...state.chatMessages, aiReply] }));
    } catch (e) {
      // Fallback
    }
  },

  addPortfolioTrade: (type, amount) => {
    const active = get().activeAsset;
    if (!active) return;

    const newTrade: PortfolioPosition = {
      id: `trade_${Date.now()}`,
      symbol: active.symbol,
      assetName: active.name,
      type,
      entryPrice: active.price,
      currentPrice: active.price,
      amount,
      pnl: 0,
      pnlPercent: 0,
      timestamp: new Date().toLocaleString()
    };

    set(state => ({ portfolio: [newTrade, ...state.portfolio] }));
  },

  closePortfolioTrade: (id) => {
    set(state => ({ portfolio: state.portfolio.filter(p => p.id !== id) }));
  },

  addPriceAlert: (targetPrice, condition) => {
    const active = get().activeAsset;
    if (!active) return;

    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}`,
      symbol: active.symbol,
      targetPrice,
      condition,
      createdAt: new Date().toLocaleTimeString(),
      active: true
    };

    set(state => ({ alerts: [newAlert, ...state.alerts] }));
  },

  removePriceAlert: (id) => {
    set(state => ({ alerts: state.alerts.filter(a => a.id !== id) }));
  }
}));
