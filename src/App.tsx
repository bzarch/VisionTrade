import React, { useEffect } from 'react';
import { useMarketStore } from './store/marketStore';
import { Navbar } from './components/Navbar';
import { MarketSelector } from './components/MarketSelector';
import { SourceSelector } from './components/SourceSelector';
import { PriceCard } from './components/PriceCard';
import { ChartContainer } from './components/ChartContainer';
import { ConfidenceGauge } from './components/ConfidenceGauge';
import { OrderBookWidget } from './components/OrderBookWidget';
import { IndicatorPanel } from './components/IndicatorPanel';
import { AIStatusBadge } from './components/AIStatusBadge';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { MultiAssetGrid } from './components/MultiAssetGrid';
import { PortfolioTracker } from './components/PortfolioTracker';
import { NewsFeed } from './components/NewsFeed';
import { MultiTimeframeAlignment } from './components/MultiTimeframeAlignment';
import { MicroAnalysisPanel } from './components/MicroAnalysisPanel';
import { RiskCalculator } from './components/RiskCalculator';
import { MarketHeatmap } from './components/MarketHeatmap';
import { EconomicCalendar } from './components/EconomicCalendar';
import { AIChatbot } from './components/AIChatbot';
import { DisclaimerFooter } from './components/DisclaimerFooter';

export function App() {
  const { fetchMarketData, activeTab } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
    // Auto refresh market prices every 15 seconds
    const timer = setInterval(() => {
      fetchMarketData();
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Vision Pro Spatial Glass Background Light Gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[550px] h-[550px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Main Glass Header */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6 relative z-10">
        
        {/* Market & Data Source Selector Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <MarketSelector />
          </div>
          <div className="lg:col-span-4">
            <AIStatusBadge />
          </div>
        </div>

        {/* Dynamic View Routing */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Source Selector Bar */}
            <SourceSelector />

            {/* Top Grid: Real-Time Price Card + Confluence AI Gauge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <PriceCard />
              </div>
              <div className="lg:col-span-5">
                <ConfidenceGauge />
              </div>
            </div>

            {/* Middle Grid: Recharts Candlestick Chart + Order Book */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <ChartContainer />
              </div>
              <div className="lg:col-span-4">
                <OrderBookWidget />
              </div>
            </div>

            {/* Mathematical Indicators Engine Panel */}
            <IndicatorPanel />

            {/* Micro & Corporate Fundamentals Analysis Panel */}
            <MicroAnalysisPanel />

            {/* Multi-Timeframe Trend Confluence Alignment */}
            <MultiTimeframeAlignment />

            {/* 3 AI Agents Breakdown Panel (Technical, Sentiment, Macro) */}
            <AIInsightsPanel />
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="space-y-6">
            <SourceSelector />
            <MultiAssetGrid />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTracker />
        )}

        {activeTab === 'calculator' && (
          <RiskCalculator />
        )}

        {activeTab === 'heatmap' && (
          <MarketHeatmap />
        )}

        {activeTab === 'calendar' && (
          <EconomicCalendar />
        )}

        {activeTab === 'news' && (
          <NewsFeed />
        )}

      </main>

      {/* Floating Gemini 3.6 Flash Spatial Chatbot */}
      <AIChatbot />

      {/* Legal & Financial Risk Disclaimer */}
      <DisclaimerFooter />
    </div>
  );
}

export default App;
