# 📈 VisionTrade — Institutional Market Analysis & AI Technical Engine

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)](https://github.com/bzarch/VisionTrade)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)]
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)]
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)]
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](./LICENSE)

VisionTrade adalah platform analisis pasar finansial *real-time* yang menggabungkan mesin teknikal kuantitatif, agregator data multi-asset, dan agen AI multimodal untuk menghasilkan sinyal trading dan insight yang dapat dipakai oleh trader profesional, analis riset, dan investor institusional.

This README contains both Indonesian and English sections. Skip to the English section by searching for "English".

---

## ✨ Fitur Utama / Key Features

- Live multi-asset data streams (crypto, global equities, IDX, forex, commodities).
- Teknikal & indikator kuantitatif: RSI, MACD, SMA (20/50/200), Bollinger Bands, ATR, confluence scoring.
- Micro-fundamentals untuk saham (PER, PBV, ROE, likuiditas, order book pressure).
- Multimodal AI ensemble (Technical, Sentiment, Macro) terintegrasi dengan Google Gemini (opsional) + deterministic fallback.
- API server (Express + Vite middleware) untuk integrasi frontend atau klien pihak ketiga.

---

## Arsitektur Singkat / Architecture

- Frontend: React 18, TypeScript, Vite, Tailwind CSS.
- Backend: Node.js + Express, TypeScript, ESBuild untuk bundle produksi.
- AI: @google/genai (Gemini) — opsional; repo menyediakan fallback deterministik saat API key atau quota tidak tersedia.
- Data adapters: modul adapter untuk Binance, Yahoo Finance, IDX adapter, Forex adapters.

---

## Struktur Repository (Ringkasan)

```
.env.example        # contoh environment variables (GEMINI_API_KEY optional)
index.html          # SPA entry (production static)
package.json        # scripts & dependencies
server.ts           # Entry Express server + Vite dev middleware
vite.config.ts      # Vite config
tsconfig.json       # TypeScript config
lib/                # Backend implementation
  data-sources/     # Adapters: binance, yahoo, idx, forex, factory
  indicators/       # Implementasi RSI, MACD, SMA, Bollinger, confluence
  ai-agents/        # unified-agent (Gemini + fallback), confluence engine
src/                # Shared types and frontend source
  types.ts          # TypeScript interfaces & domain types
assets/             # Static assets
README.md           # Anda membaca ini
LICENSE             # MIT License
bun.lock            # lockfile (if using bun)
```

---

## Cara Cepat Menjalankan / Quick Start

Prasyarat / Prereqs:
- Node.js v18+ (direkomendasikan)
- npm atau bun

1) Clone repo

```bash
git clone https://github.com/bzarch/VisionTrade
cd VisionTrade
```

2) Install dependensi

```bash
npm install
```

3) Buat file .env berdasarkan .env.example (opsional untuk fitur AI Gemini):

```bash
cp .env.example .env
# GEMINI_API_KEY=your_gemini_api_key_here (opsional)
```

4) Jalankan mode pengembangan (Vite + server.ts via tsx)

```bash
npm run dev
# Server akan aktif di http://localhost:3000
```

5) Build & jalankan untuk produksi

```bash
npm run build
npm start
```

---

## Docker (opsional)

Contoh Dockerfile minimal (tidak disertakan di repo):

```dockerfile
# contoh Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
RUN npm ci --production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","dist/server.cjs"]
```

Build & run:

```bash
docker build -t visiontrade:latest .
docker run -p 3000:3000 --env-file .env visiontrade:latest
```

---

## API Singkat / API Reference (ringkasan & contoh)

Base URL (dev): http://localhost:3000

1) GET /api/market
- Query: source (binance|yahoo|idx|exchangerate), category (crypto|global_stocks|idx_stocks|forex)

curl example:

```bash
curl "http://localhost:3000/api/market?source=binance"
```

Response (ringkasan):
```json
{ "status":"success", "data":[ { "id":"btc-usdt", "symbol":"BTC/USDT", "price":... }], "count": 120 }
```

2) GET /api/klines
- Query: symbol (default BTC/USDT), interval (1h), limit (60)

```bash
curl "http://localhost:3000/api/klines?symbol=BTC/USDT&interval=1h&limit=60"
```

3) GET /api/indicators
- Query: symbol, interval
- Returns computed RSI, MACD, SMA20/50/200, Bollinger bands, confluence score

```bash
curl "http://localhost:3000/api/indicators?symbol=BTC/USDT&interval=1h"
```

4) POST /api/ai/signal
- Body: { "symbol": "BTC/USDT", "price": 94850 }
- Orchestration: runs unified-agent (Gemini if available, otherwise deterministic fallback)

```bash
curl -X POST http://localhost:3000/api/ai/signal \
  -H 'Content-Type: application/json' \
  -d '{"symbol":"BTC/USDT","price":94850}'
```

Sample response (abbreviated):
```json
{ "status":"success", "data": { "finalSignal":"BUY","confidenceScore":78, ... } }
```

5) POST /api/ai/chat
- Body: { "message": "Apa outlook BTC hari ini?", "activeSymbol": "BTC/USDT" }
- If GEMINI_API_KEY missing or quota exceeded, server returns deterministic fallback message.

6) GET /api/ai/insights
- Query: symbol
- Returns 3 concise insights (Technical, Sentiment, Macro). Uses cache (3 minutes) to avoid rate limits.

7) GET /api/news, GET /api/macro
- Returns aggregated news items and macroeconomic indicators respectively.

---

## Konfigurasi & Environment

- GEMINI_API_KEY (optional) — untuk mengaktifkan panggilan Google Gemini. Jika tidak ada, repo menggunakan fallback deterministik.
- NODE_ENV (development|production)

Cache/backoff parameters ditentukan di kode (lihat lib/ai-agents/unified-agent.ts & server.ts). Anda dapat mengekspor variabel konfigurasi tambahan jika ingin menyesuaikan TTL cache atau backoff.

---

## CI / Lint / Tests (saran)

Rekomendasi singkat:
- Tambahkan GitHub Actions workflow untuk: instalasi node, menjalankan lint/tsc dan unit tests (jest/uvu).
- Tambahkan unit tests untuk fungsi indikator di lib/indicators (RSI, MACD, SMA, Bollinger).
- Tambahkan coverage dan badge (Codecov atau Coveralls) jika membutuhkan metrik kualitas.

Contoh langkah (GitHub Actions):
- name: CI
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2 # or use setup-node
    - run: npm ci
    - run: npm run lint
    - run: npm test

Saya bisa bantu menambahkan workflow file .github/workflows/ci.yml jika Anda mau.

---

## Contribution & Developer Guide

- Ikuti gaya TypeScript yang ada. Gunakan tsc --noEmit untuk static checks (skrip lint tersedia di package.json).
- Untuk menambahkan data adapter baru: buat file adapter di lib/data-sources/* dan daftarkan pada DataSourceFactory (lib/data-sources/factory.ts).
- Untuk menambahkan indikator baru: implementasikan di lib/indicators dan tambahkan pemanggilan di endpoint /api/indicators dan unified-agent jika relevan.

---

## LICENSE

MIT License — lihat file LICENSE.

---

## English Section (abridged)

VisionTrade is a real-time institutional market analysis platform combining quantitative technical indicators, multi-source market data adapters and a multimodal AI ensemble (Gemini integration optional) to produce trading signals and concise market insights.

Quick Start (English):
1. git clone ...
2. npm install
3. cp .env.example .env (set GEMINI_API_KEY if desired)
4. npm run dev

API: Refer to the API Reference section above for endpoints and example curl commands.

Docker: See Docker example above for a minimal production container recipe.

CI & Tests: Add GitHub Actions workflow to run TypeScript checks and unit tests. I can add a starter .github/workflows/ci.yml if you want.

---

If you want, I will:
1. Commit this updated README.md to the repository (on the default branch).
2. Optionally open a PR to propose additional files: GitHub Actions CI workflow and a sample Dockerfile.

