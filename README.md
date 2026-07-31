# 📈 VisionTrade Pro - Institutional Financial Market & AI Analytics Engine

<p align="center">
  <img src="https://img.shields.io/badge/VisionTrade-Pro_v1.0-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="VisionTrade Pro" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-amber?style=for-the-badge" alt="License" />
</p>

**VisionTrade Pro** adalah platform analisis pasar keuangan multi-aset dan agregator data *real-time* bertenaga **AI & Quantitative Mathematical Models**. Dirancang untuk trader profesional, analis kuantitatif, dan investor institusional yang membutuhkan data riil multi-pasar (*Global Tech Stocks, IDX Indonesia Stocks, Crypto Futures/Spot, Forex, & Commodities*) tanpa data tiruan atau simulasi dummy.

---

## 🔗 Repository GitHub & Quick Push

* **GitHub Repository**: [https://github.com/bzarch/VisionTrade](https://github.com/bzarch/VisionTrade)

### 📌 Langkah Push Kode ke Repository GitHub Anda:
```bash
# 1. Inisialisasi git repository (jika belum)
git init

# 2. Tambahkan seluruh file ke staging area
git add .

# 3. Buat commit pertama
git commit -m "feat: release VisionTrade Pro - institutional market engine & AI analytics"

# 4. Atur branch utama ke main
git branch -M main

# 5. Hubungkan ke remote repository
git remote add origin https://github.com/bzarch/VisionTrade.git

# 6. Push kode ke GitHub (Gunakan --force jika repository remote baru diinisialisasi)
git push -u origin main --force
```

---

## 🔥 Fitur Utama & Modul Unggulan (Core Features)

### 1. 🌐 Live Multi-Asset Data Aggregator Engine
Platform ini menggunakan sistem multi-adapter cerdas untuk mengambil stream data riil langsung dari Bursa Global dan Provider API terpercaya:
* 🪙 **Cryptocurrency Spot & Futures**: Data Binance WebSocket & Public REST (BTC, ETH, SOL, BNB, XRP, DOGE, ADA, SHIB, PEPE, SUI, APT, NEAR, dll.).
* 🇮🇩 **Saham Indonesia / IDX High Liquidity**: Data Saham Bursa Efek Indonesia terorganisasi per sektor (Perbankan: BBCA, BBRI, BMRI, BRIS; Teknologi: GOTO, BUKA, EMTK; Menara: TLKM, ISAT, EXCL, TOWR; Energi & Tambang: BREN, AMMN, ADRO, PTBA, ANTM, INCO, MEDC; Konsumer: UNVR, ICBP, INDF, ASII; Properti: CTRA, BSDE, PWON, SMRA).
* 🇺🇸 **US & Global Equities**: Megacaps & Tech Titans (NVDA, AAPL, MSFT, GOOGL, AMZN, META, TSLA, AMD, NFLX, BABA, dll.).
* 💱 **Forex Pairs & Commodities**: Real-time Exchange rates & Commodity Spot Prices (EUR/USD, GBP/USD, USD/JPY, USD/IDR, Gold XAU/USD, Silver, Crude Oil WTI, Brent, Natural Gas, Copper, Wheat).
* 📊 **World Indices**: S&P 500, Nasdaq 100, Dow Jones 30, Nikkei 225, FTSE 100, DAX 40, Hang Seng, & IHSG Composite.

### 2. 🤖 AI Multi-Agent Confluence Engine
Mesin analisis prediktif berbasis konsensus multi-agen yang menggabungkan 4 bidang analisis keuangan terpisah:
1. **Quantitative Technical Agent**: Menghitung kalkulasi matematis presisi (SMA, EMA, RSI Wilders, MACD Signal, Bollinger Bands S.D., ATR Volatility, Pivot Points & Support/Resistance Levels).
2. **Micro-Fundamental Agent**: Evaluasi kesehatan neraca perbankan & perusahaan (Market Cap, P/E Ratio, P/BV, ROE, Net Margin, Dividend Yield).
3. **Macro-Economic Analyst Agent**: Integrasi indeks makro ekonomi, ekspektasi suku bunga central bank (Fed/BI), inflasi CPI, dan imbal hasil obligasi pemerintah (US10Y / ID10Y).
4. **Sentiment & Liquidity Tracker Agent**: Pelacakan volume transaksi, tekanan order book bid/ask, serta rasio lonjakan volatilitas pasar.

### 3. 📊 Advanced Interactive Technical Charting & Indicators
* Multi-timeframe selection (1M, 5M, 15M, 1H, 4H, 1D, 1W).
* Visualisasi grafik Candle & Line dengan indikator teknis aktif (Bollinger Bands overlay, SMA 20/50/200, RSI oscillator, MACD histogram).
* Penanda sinyal konfluensi otomatis (*BUY / SELL / NEUTRAL*) disertai *Confidence Level Gauge* (0 - 100%).

### 4. ⚡ Live Orderbook & Market Depth Visualization
* Tampilan susunan antrean *Bid vs Ask* real-time.
* Kalkulator rasio akumulasi vs distribusi volume (*Buying vs Selling Pressure Ratio*).
* Deteksi zona *Order Block* & tingkat likuiditas kritis.

### 5. 🔍 Institutional Market Screener & Heatmap
* Filter saham & aset berdasarkan kriteria PER, PBV, ROE, Dividend Yield, Market Cap, dan Perubahan Harga (24h Change).
* Peta kalor (Heatmap) visual untuk sektor pasar saham & aset digital.

### 6. 📅 Economic Calendar & News Feed Integration
* Jadwal rilis berita ekonomi berdampak tinggi (FOMC Rate Decision, CPI Inflation Rate, Non-Farm Payrolls, GDP Growth).
* Agregasi berita pasar keuangan terbaru dari berbagai sumber internasional & domestik.

### 7. 🧮 Institutional Risk Calculator & Portfolio Tracker
* **Position Sizing Calculator**: Menghitung Lot / Unit saham atau aset crypto berdasarkan Risk Tolerance (1%-3% per trade), Stop Loss, dan Take Profit ratio.
* **Portfolio Tracker**: Pemantauan portofolio transaksi, rasio PnL (Profit & Loss), dan alokasi aset secara langsung.

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          VisionTrade Pro UI                            │
│           (React 19 + TypeScript + Tailwind CSS 4 + Motion)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Express Node Server (CJS)                        │
│             (Custom Data Proxies + Vite Integration Middleware)        │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
┌───────────────────▼───────────┐       ┌───────────▼────────────────────┐
│   Data Provider Adapters      │       │    AI Confluence Engine        │
│ ├─ Binance Adapter (Crypto)   │       │ ├─ Technical Quant Agent       │
│ ├─ BagusKTO Adapter (IDX)     │       │ ├─ Micro Fundamentals Agent    │
│ ├─ Yahoo Finance (US/Indices) │       │ ├─ Macro Economic Agent        │
│ └─ ExchangeRate API (FX/Metal)│       │ └─ Sentiment & Liquidity Agent │
└───────────────────────────────┘       └────────────────────────────────┘
```

* **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
* **Backend Runtime**: Node.js, Express, ESBuild CJS Bundler, TSX.
* **Storage / State**: Client-side Zustand / State management dengan struktur modular.
* **API Providers**: Binance Public API, Yahoo Finance, ExchangeRate API, BagusKTO Custom IDX Adapter.

---

## 📂 Structure Folder Project (Repository Tree)

```text
VisionTrade/
├── .env.example                # Sample environment configuration
├── .gitignore                  # Git ignore definitions
├── LICENSE                     # MIT License documentation
├── README.md                   # Complete Project Documentation
├── metadata.json               # Platform Applet Metadata
├── package.json                # Project dependencies & scripts
├── server.ts                   # Express server entry point with Vite API proxying
├── vite.config.ts              # Vite configuration
├── lib/                        # Core Data Adapters & AI Engines
│   ├── ai-agents/              # Multi-Agent Confluence AI System
│   │   ├── confluence-engine.ts
│   │   ├── macro-agent.ts
│   │   ├── sentiment-agent.ts
│   │   ├── technical-agent.ts
│   │   └── unified-agent.ts
│   ├── data-sources/           # Realtime Exchange Adapters
│   │   ├── adapter-interface.ts
│   │   ├── baguskto-adapter.ts # IDX Stocks Data Engine
│   │   ├── binance-adapter.ts  # Crypto Spot & Futures Engine
│   │   ├── factory.ts          # Adapter Factory Pattern
│   │   ├── itick-adapter.ts    # iTick Market Adapter
│   │   └── yahoo-adapter.ts    # US Stocks & World Indices Engine
│   └── indicators/             # Quantitative Technical Math Library
│       ├── bollinger.ts
│       ├── confluence.ts
│       ├── macd.ts
│       ├── rsi.ts
│       └── sma.ts
└── src/                        # React Frontend Source Code
    ├── App.tsx                 # Main Application Workspace Layout
    ├── main.tsx                # Entry point
    ├── index.css               # Global Tailwind CSS Styles
    ├── types.ts                # Global TypeScript Type Declarations
    ├── store/                  # Application State & Data Pipelines
    │   └── marketStore.ts
    └── components/             # Modular Financial UI Components
        ├── AIChatbot.tsx
        ├── AIInsightsPanel.tsx
        ├── AIStatusBadge.tsx
        ├── ChartContainer.tsx
        ├── ConfidenceGauge.tsx
        ├── DisclaimerFooter.tsx
        ├── EconomicCalendar.tsx
        ├── IndicatorPanel.tsx
        ├── MarketHeatmap.tsx
        ├── MarketScreener.tsx
        ├── MarketSelector.tsx
        ├── MicroAnalysisPanel.tsx
        ├── MultiAssetGrid.tsx
        ├── MultiTimeframeAlignment.tsx
        ├── Navbar.tsx
        ├── NewsFeed.tsx
        ├── OrderBookWidget.tsx
        ├── PortfolioTracker.tsx
        ├── PriceAlertsAndFXMatrix.tsx
        ├── PriceCard.tsx
        ├── RiskCalculator.tsx
        └── SourceSelector.tsx
```

---

## ⚡ Setup & Instalasi Lokal (Quick Start)

### Prasyarat System
* **Node.js**: v18.0.0 atau lebih tinggi
* **npm**: v9.0.0 atau lebih tinggi

### 1. Clone & Salin Project
```bash
git clone https://github.com/bzarch/VisionTrade.git
cd VisionTrade
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di direktori utama:
```bash
cp .env.example .env
```
Isikan kredensial opsional (seperti `GEMINI_API_KEY` untuk asisten AI opsional):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser dan akses platform di: **`http://localhost:3000`**

### 5. Compile & Build Produksi
```bash
# Build bundle React & bundling CJS Express Server
npm run build

# Jalankan server hasil build produksi
npm start
```

---

## 📄 Lisensi (License)

Proyek ini dilisensikan secara resmi di bawah **MIT License**. Lihat file [LICENSE](./LICENSE) untuk detail hak cipta penuh.

---

<p align="center">
  Crafted with precision for Quantitative Traders, Market Analysts, and Financial Developers worldwide.
  <br />
  <strong>VisionTrade Pro &copy; 2026</strong>
</p>
