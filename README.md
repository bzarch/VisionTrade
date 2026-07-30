# 📈 Institutional Financial Market Platform & AI Technical Analysis Engine

![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

Platform analisis pasar keuangan dan agregator data *real-time* berbasis **AI & Quantitative Mathematical Models**. Dirancang untuk trader profesional, analis riset, dan investor institusional yang membutuhkan data riil multi-aset (*Global Stocks, IDX Stocks, Crypto, Forex, & Commodities*) tanpa simulasi atau data tiruan.

---

## ✨ Fitur Unggulan (Key Features)

### 1. 🌐 Live Multi-Asset Global Data Streams
* **Data Real-Time**: Terhubung langsung ke API Exchange publik (Binance Public API, Yahoo Finance Live, ExchangeRate API, & IDX Adapter).
* **Ekosistem Aset Lengkap**:
  * 🪙 **Kripto Top Cap & Alts** (BTC, ETH, SOL, BNB, XRP, ADA, DOGE, SUI, PEPE, WIF, dll.)
  * 🇺🇸 **Saham Global / US Tech & Megacaps** (NVDA, AAPL, MSFT, GOOGL, AMZN, META, TSLA, ASML, LVMH, SONY, dll.)
  * 🇮🇩 **Saham Indonesia / IDX High Liquidity** (BBCA, BBRI, BMRI, BBNI, TLKM, ASII, UNVR, GOTO, BREN, AMMN, ADRO, MDKA, dll.)
  * 💱 **Forex & Komoditas** (EUR/USD, GBP/USD, USD/JPY, USD/IDR, Gold XAU/USD, Silver, Crude Oil WTI, Brent, Natural Gas, Copper, Wheat, Corn).
  * 📊 **Indeks Utama Dunia** (S&P 500, Nasdaq, Dow Jones, Nikkei 225, FTSE 100, DAX 40, Hang Seng, IHSG).

### 2. 🏢 Analisis Mikro & Fondamental Perusahaan (Micro-Fundamentals)
* **Metrik Finansial Internal**: Market Cap, P/E Ratio (PER), Price-to-Book Value (P/BV), Return on Equity (ROE), Net Profit Margin, dan Dividend Yield.
* **Likuiditas & Struktur Orderbook**: Pemantauan Spread Bid-Ask, Tekanan Pembeli vs Penjual (Orderbook Pressure), serta Sinyal Aliran Mikro (*Accumulation, Distribution, Breakout, Consolidation*).

### 3. 🤖 Multimodal AI Signal Generator
* Menyatukan 4 model analisis terpisah (*Multi-Agent Ensemble*):
  1. **Quant Engine** (SMA, EMA, RSI, MACD, Bollinger Bands, ATR, Support/Resistance).
  2. **Micro-Fundamental Specialist** (Solvensi, Profitabilitas, Valuasi PER/PBV).
  3. **Macro Economic Analyst** (Suku Bunga, Inflasi, Imbal Hasil Obligasi/Treasury).
  4. **Sentiment & Liquidity Tracker** (Volatilitas, Aliran Dana Institusi, Sentiment Index).

---

## 🛠️ Arsitektur Teknologi (Tech Stack)

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion (Framer Motion).
* **Backend Runtime**: Node.js, Express, ESBuild CJS Bundler.
* **Data Providers**:
  * `Binance REST API` untuk data Kripto spot & Klines.
  * `Yahoo Finance API` untuk ekuitas global & indeks saham.
  * `ExchangeRate-API` untuk FX rates & komoditas spot.
  * Custom `IDX Data Adapter` untuk bursa efek Indonesia.

---

## 🚀 Panduan Jalankan Aplikasi (Quick Start)

### Prasyarat
* **Node.js**: v18.0.0 atau lebih baru
* **npm** atau **bun**

### 1. Clone Repository
```bash
git clone https://github.com/bzarch/VisionTrade
cd VisionTrade
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` berdasarkan sampel `.env.example`:
```bash
cp .env.example .env
```

Isi kunci API jika diperlukan (opsional untuk fitur AI Gemini):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Jalankan Moda Pengembang (Development)
```bash
npm run dev
```
Aplikasi akan berjalan secara otomatis di `http://localhost:3000`.

### 5. Build untuk Produksi
```bash
npm run build
npm start
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - Lihat file [LICENSE](./LICENSE) untuk detail lengkap.

---

<p align="center">
  Dibuat dengan ❤️ untuk komunitas trader dan pengembang teknologi finansial.
</p>
