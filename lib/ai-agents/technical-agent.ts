import { GoogleGenAI } from '@google/genai';
import { AgentSignal, IndicatorValues, Kline } from '../../src/types';

export async function runTechnicalAgent(
  symbol: string,
  price: number,
  indicators: IndicatorValues,
  klines: Kline[]
): Promise<AgentSignal> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const prompt = `
Anda adalah Technical Analysis AI Agent senior.
Analisis data teknikal berikut untuk aset ${symbol}:
- Harga Sekarang: ${price}
- RSI (14): ${indicators.rsi}
- MACD Histogram: ${indicators.macd.histogram} (MACD Line: ${indicators.macd.macdLine}, Signal: ${indicators.macd.signalLine})
- SMA 20: ${indicators.sma.sma20}, SMA 50: ${indicators.sma.sma50}, SMA 200: ${indicators.sma.sma200}
- Bollinger Band Upper: ${indicators.bollinger.upper}, Lower: ${indicators.bollinger.lower}, %B: ${indicators.bollinger.percentB}
- Volume Ratio (terhadap rata-rata 20 periode): ${indicators.volumeRatio}x

Berikan output JSON dengan format persis berikut:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": number (0-100),
  "reasoning": "Penjelasan teknikal rinci 2-3 kalimat",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH"
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
        return {
          agentName: 'Technical AI',
          signal: parsed.signal || 'HOLD',
          confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 70)),
          reasoning: parsed.reasoning || 'Analisis teknikal berbasis kombinasi momentum RSI dan MACD.',
          riskLevel: parsed.riskLevel || 'MEDIUM'
        };
      }
    } catch (err) {
      console.warn('Technical AI Agent Gemini call error, using deterministic calculation:', err);
    }
  }

  // Deterministic fallback based on indicators
  let score = 50;
  if (indicators.rsi < 35) score += 25;
  if (indicators.rsi > 65) score -= 25;
  if (indicators.macd.histogram > 0) score += 20;
  if (indicators.macd.histogram < 0) score -= 20;
  if (price > indicators.sma.sma20) score += 15;
  if (price < indicators.sma.sma20) score -= 15;

  const signal = score >= 65 ? 'BUY' : score <= 35 ? 'SELL' : 'HOLD';
  const confidence = Math.min(95, Math.max(50, Math.abs(score - 50) * 2 + 50));

  return {
    agentName: 'Technical AI',
    signal,
    confidence,
    reasoning: `Indikator RSI (${indicators.rsi}) dan MACD (${indicators.macd.histogram > 0 ? 'bullish' : 'bearish'}) menunjukkan struktur harga ${signal === 'BUY' ? 'positif' : signal === 'SELL' ? 'tekanan jual' : 'konsolidasi'}.`,
    riskLevel: Math.abs(score - 50) > 30 ? 'HIGH' : 'MEDIUM'
  };
}
