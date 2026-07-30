import { GoogleGenAI } from '@google/genai';
import { AgentSignal, MacroIndicator } from '../../src/types';

export async function runMacroAgent(
  symbol: string,
  macroData: MacroIndicator[]
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

      const macroContext = macroData.map(m => `- ${m.indicator} (${m.country}): ${m.value}${m.unit} (Trend: ${m.trend})`).join('\n');
      const prompt = `
Anda adalah Macro Economic AI Agent.
Analisis proyeksi ekonomi makro berikut untuk implikasi perdagangan aset ${symbol}:
${macroContext}

Berikan output JSON dengan format:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": number (0-100),
  "reasoning": "Analisis dampak makro ekonomi 2-3 kalimat",
  "impactScore": number (0-100)
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
          agentName: 'Macro AI',
          signal: parsed.signal || 'HOLD',
          confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 72)),
          reasoning: parsed.reasoning || 'Kondisi suku bunga dan inflasi global memberikan katalis positif jangka panjang.',
          impactScore: parsed.impactScore || 70,
          riskLevel: 'LOW'
        };
      }
    } catch (err) {
      console.warn('Macro AI Agent error fallback:', err);
    }
  }

  // Fallback
  return {
    agentName: 'Macro AI',
    signal: 'BUY',
    confidence: 78,
    reasoning: 'Kombinasi melandainya inflasi CPI dan ekspektasi penurunan suku bunga acuan bank sentral menciptakan iklim likuiditas yang menguntungkan aset berisiko.',
    impactScore: 75,
    riskLevel: 'LOW'
  };
}
