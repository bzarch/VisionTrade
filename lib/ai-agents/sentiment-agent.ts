import { GoogleGenAI } from '@google/genai';
import { AgentSignal, NewsItem } from '../../src/types';

export async function runSentimentAgent(
  symbol: string,
  news: NewsItem[]
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

      const newsContext = news.map(n => `- ${n.title} (${n.sentiment})`).join('\n');
      const prompt = `
Anda adalah Market Sentiment AI Agent.
Analisis sentimen berita & media sosial untuk aset ${symbol}:
${newsContext}

Berikan output JSON dengan format:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": number (0-100),
  "reasoning": "Ringkasan sentimen pasar 2 kalimat",
  "sentimentScore": number (-1.0 to 1.0),
  "keyEvents": ["event1", "event2"]
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
          agentName: 'Sentiment AI',
          signal: parsed.signal || 'HOLD',
          confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 75)),
          reasoning: parsed.reasoning || 'Sentimen berita pasar menunjukkan narasi dominan yang moderat.',
          riskLevel: parsed.sentimentScore > 0.5 ? 'LOW' : 'MEDIUM',
          keyEvents: parsed.keyEvents || ['Institusi akumulasi spot', 'Suku bunga melandai']
        };
      }
    } catch (err) {
      console.warn('Sentiment AI Agent error fallback:', err);
    }
  }

  // Fallback
  const avgSentiment = news.reduce((acc, n) => acc + n.sentimentScore, 0) / Math.max(1, news.length);
  const signal = avgSentiment > 0.2 ? 'BUY' : avgSentiment < -0.2 ? 'SELL' : 'HOLD';

  return {
    agentName: 'Sentiment AI',
    signal,
    confidence: Math.min(90, Math.round(50 + Math.abs(avgSentiment) * 45)),
    reasoning: `Agregasi sentimen berita pasar berada pada skor ${avgSentiment.toFixed(2)}, mengindikasikan suasana pasar ${signal === 'BUY' ? 'optimis' : signal === 'SELL' ? 'hati-hati' : 'netral'}.`,
    riskLevel: 'MEDIUM',
    keyEvents: news.slice(0, 2).map(n => n.title)
  };
}
