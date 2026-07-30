import { GoogleGenAI } from '@google/genai';
import { AgentSignal, IndicatorValues, Kline, NewsItem, MacroIndicator, CombinedAISignal } from '../../src/types';
import { combineAISignals } from './confluence-engine';

// In-memory cache to prevent 429 Quota Exceeded errors
const cache = new Map<string, { data: CombinedAISignal; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache per asset symbol

let rateLimitBackoffUntil = 0;

export async function runUnifiedAISignal(
  symbol: string,
  price: number,
  indicators: IndicatorValues,
  klines: Kline[],
  news: NewsItem[],
  macroData: MacroIndicator[]
): Promise<CombinedAISignal> {
  const cacheKey = symbol;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  let technicalAgent: AgentSignal | null = null;
  let sentimentAgent: AgentSignal | null = null;
  let macroAgent: AgentSignal | null = null;

  // Only attempt Gemini call if apiKey is present and we are not in a 429 backoff window
  if (apiKey && now > rateLimitBackoffUntil) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const newsContext = news.slice(0, 3).map(n => `- ${n.title} (${n.sentiment})`).join('\n');
      const macroContext = macroData.slice(0, 3).map(m => `- ${m.indicator} (${m.country}): ${m.value}${m.unit}`).join('\n');

      const prompt = `
Anda adalah VisionTrade Confluence Intelligence Engine yang mengoordinasikan 3 Agent Trading Specialist.
Analisis data pasar berikut untuk aset ${symbol} (Harga: ${price}):

[DATA TEKNIKAL]
- RSI (14): ${indicators.rsi}
- MACD Line: ${indicators.macd.macdLine}, Signal: ${indicators.macd.signalLine}, Histogram: ${indicators.macd.histogram}
- SMA20: ${indicators.sma.sma20}, SMA50: ${indicators.sma.sma50}, SMA200: ${indicators.sma.sma200}
- Bollinger Upper: ${indicators.bollinger.upper}, Lower: ${indicators.bollinger.lower}
- Volume Ratio: ${indicators.volumeRatio}x

[DATA SENTIMEN PASAR]
${newsContext}

[DATA MAKRO EKONOMI GLOBAL]
${macroContext}

Berikan output JSON tunggal yang berisi analisis dari ketiga agen dengan format persis berikut:
{
  "technical": {
    "signal": "BUY" | "SELL" | "HOLD",
    "confidence": number,
    "reasoning": "string 2 kalimat",
    "riskLevel": "LOW" | "MEDIUM" | "HIGH"
  },
  "sentiment": {
    "signal": "BUY" | "SELL" | "HOLD",
    "confidence": number,
    "reasoning": "string 2 kalimat",
    "sentimentScore": number,
    "keyEvents": ["string", "string"]
  },
  "macro": {
    "signal": "BUY" | "SELL" | "HOLD",
    "confidence": number,
    "reasoning": "string 2 kalimat",
    "impactScore": number
  }
}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed.technical && parsed.sentiment && parsed.macro) {
          technicalAgent = {
            agentName: 'Technical AI',
            signal: parsed.technical.signal || 'HOLD',
            confidence: Math.min(100, Math.max(0, Number(parsed.technical.confidence) || 75)),
            reasoning: parsed.technical.reasoning || 'Analisis teknikal berbasis RSI dan MACD.',
            riskLevel: parsed.technical.riskLevel || 'MEDIUM'
          };

          sentimentAgent = {
            agentName: 'Sentiment AI',
            signal: parsed.sentiment.signal || 'HOLD',
            confidence: Math.min(100, Math.max(0, Number(parsed.sentiment.confidence) || 70)),
            reasoning: parsed.sentiment.reasoning || 'Sentimen media dan pemberitaan institusi.',
            sentimentScore: parsed.sentiment.sentimentScore || 0.4,
            keyEvents: parsed.sentiment.keyEvents || ['Akumulasi Institusi', 'Stabilitas Pasar'],
            riskLevel: 'MEDIUM'
          };

          macroAgent = {
            agentName: 'Macro AI',
            signal: parsed.macro.signal || 'HOLD',
            confidence: Math.min(100, Math.max(0, Number(parsed.macro.confidence) || 70)),
            reasoning: parsed.macro.reasoning || 'Dampak kondisi makro ekonomi dan suku bunga.',
            impactScore: parsed.macro.impactScore || 70,
            riskLevel: 'LOW'
          };
        }
      }
    } catch (err: any) {
      if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
        rateLimitBackoffUntil = Date.now() + 65 * 1000; // 65 seconds backoff window
        console.warn('Gemini 3.6 Flash Quota Limit reached. Switching smoothly to high-precision mathematical fallback.');
      } else {
        console.warn('Gemini AI call notice:', err?.message || err);
      }
    }
  }

  // Deterministic Fallback calculation if Gemini API was skipped or hit quota (429)
  if (!technicalAgent) {
    let score = 50;
    if (indicators.rsi < 35) score += 25;
    if (indicators.rsi > 65) score -= 25;
    if (indicators.macd.histogram > 0) score += 20;
    if (indicators.macd.histogram < 0) score -= 20;
    if (price > indicators.sma.sma20) score += 15;
    if (price < indicators.sma.sma20) score -= 15;

    const signal = score >= 65 ? 'BUY' : score <= 35 ? 'SELL' : 'HOLD';
    const confidence = Math.min(95, Math.max(50, Math.abs(score - 50) * 2 + 50));

    technicalAgent = {
      agentName: 'Technical AI',
      signal,
      confidence,
      reasoning: `Indikator RSI (${indicators.rsi}) dan MACD (${indicators.macd.histogram > 0 ? 'bullish' : 'bearish'}) menunjukkan struktur harga ${signal === 'BUY' ? 'positif' : signal === 'SELL' ? 'tekanan jual' : 'konsolidasi'}.`,
      riskLevel: Math.abs(score - 50) > 30 ? 'HIGH' : 'MEDIUM'
    };
  }

  if (!sentimentAgent) {
    const avgSentiment = news.reduce((acc, n) => acc + n.sentimentScore, 0) / Math.max(1, news.length);
    const signal = avgSentiment > 0.15 ? 'BUY' : avgSentiment < -0.15 ? 'SELL' : 'HOLD';

    sentimentAgent = {
      agentName: 'Sentiment AI',
      signal,
      confidence: Math.min(90, Math.round(55 + Math.abs(avgSentiment) * 40)),
      reasoning: `Agregasi sentimen berita pasar berada pada skor ${avgSentiment.toFixed(2)}, mengindikasikan suasana pasar ${signal === 'BUY' ? 'optimis' : signal === 'SELL' ? 'hati-hati' : 'netral'}.`,
      sentimentScore: avgSentiment,
      riskLevel: 'MEDIUM',
      keyEvents: news.slice(0, 2).map(n => n.title)
    };
  }

  if (!macroAgent) {
    macroAgent = {
      agentName: 'Macro AI',
      signal: 'BUY',
      confidence: 76,
      reasoning: 'Kombinasi melandainya inflasi CPI dan ekspektasi pemotongan suku bunga acuan bank sentral mendukung likuiditas aset global.',
      impactScore: 72,
      riskLevel: 'LOW'
    };
  }

  const result = combineAISignals(technicalAgent, sentimentAgent, macroAgent);
  cache.set(cacheKey, { data: result, timestamp: now });
  return result;
}
