import { CombinedAISignal, AgentSignal, SignalType } from '../../src/types';

export function combineAISignals(
  technical: AgentSignal,
  sentiment: AgentSignal,
  macro: AgentSignal
): CombinedAISignal {
  // Signal values: BUY = +1, HOLD = 0, SELL = -1
  const signalToVal = (sig: SignalType) => (sig === 'BUY' ? 1 : sig === 'SELL' ? -1 : 0);

  const techVal = signalToVal(technical.signal) * (technical.confidence / 100);
  const sentVal = signalToVal(sentiment.signal) * (sentiment.confidence / 100);
  const macVal = signalToVal(macro.signal) * (macro.confidence / 100);

  // Weighted average score (-1.0 to +1.0)
  // Technical 50%, Sentiment 30%, Macro 20%
  const weightedValue = techVal * 0.50 + sentVal * 0.30 + macVal * 0.20;

  // Confidence Score: 0 to 100
  const confidenceScore = Math.min(
    99,
    Math.max(45, Math.round(technical.confidence * 0.50 + sentiment.confidence * 0.30 + macro.confidence * 0.20))
  );

  let finalSignal: SignalType = 'HOLD';
  if (weightedValue > 0.20) {
    finalSignal = 'BUY';
  } else if (weightedValue < -0.20) {
    finalSignal = 'SELL';
  } else {
    finalSignal = 'HOLD';
  }

  return {
    finalSignal,
    confidenceScore,
    technicalAgent: technical,
    sentimentAgent: sentiment,
    macroAgent: macro,
    confluenceWeight: {
      technical: 50,
      sentiment: 30,
      macro: 20
    },
    timestamp: new Date().toLocaleTimeString(),
    modelUsed: 'gemini-3.6-flash'
  };
}
