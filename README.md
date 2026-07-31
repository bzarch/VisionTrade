# 📈 VisionTrade — Institutional Financial Market Platform & AI Technical Analysis Engine

![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=github)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

Platform analisis pasar keuangan dan agregator data *real-time* berbasis **AI & Quantitative Mathematical Models**. Dirancang untuk trader profesional, analis riset, dan investor institusional yang memerlukan sinyal analitis, visualisasi pasar, dan pemantauan multi-aset.

---

## ✨ Fitur Unggulan
- Live multi-asset data streams (crypto, equities, forex, commodities, IDX adapter)
- AI multimodal signal generator (quant, micro-fundamental, macro, sentiment)
- Realtime charts, orderbook, portfolio tracker, screener, economic calendar, dan alerting

---

## 🛠️ Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- UI/animation: Lucide Icons, Framer Motion
- State: Zustand
- Charts: Recharts
- Backend runtime (SSR/serving): Node.js + Express, bundled with esbuild

---

## 🚀 Quick Start (Development)

Prerequisites
- Node.js v18+ (recommended v20)
- npm (we use npm for lockfile updates)
- Docker (optional, for container runs)

1. Clone
```bash
git clone https://github.com/bzarch/VisionTrade.git
cd VisionTrade
```

2. Copy example env and set keys
```bash
cp .env.example .env
# Edit .env to add any API keys (optional)
```

3. Install
```bash
npm install
```

4. Run development server
```bash
npm run dev
```
Open http://localhost:3000

---

## 📦 Build & Production

Build the app and the server bundle:
```bash
npm run build
npm start
```

---

## 🐳 Docker (Production image)
A multi-stage Dockerfile has been added at `./Dockerfile` to build and run the production bundle.

Build image:
```bash
docker build -t visiontrade:latest .
```

Run container (reads environment from `.env`):
```bash
docker run -p 3000:3000 --env-file .env visiontrade:latest
```

Or use npm helper scripts:
```bash
npm run docker:build
npm run docker:run
```

---

## 🔄 Full Dependency Upgrade (how we did it)
This repository uses npm and package-lock.json for reproducible installs. To upgrade dependencies (major allowed), the recommended flow is:

1. Install ncu (npm-check-updates) globally:
```bash
npm install -g npm-check-updates
```
2. Preview upgrades (dry-run):
```bash
npx npm-check-updates
```
3. Apply upgrades to package.json:
```bash
npx npm-check-updates -u
```
4. Install and update lockfile:
```bash
npm install
```
5. Build and test:
```bash
npm run build
npm start
# run manual smoke tests: open http://localhost:3000 and check charts, orderbook, AI chat, indicators
```

If issues appear, revert the changes and upgrade packages in smaller groups.

---

## 🔧 Notes about package changes
- The ambiguous package `motion` was replaced with `framer-motion` and imports/usage were updated accordingly. If you intentionally used a different `motion` package, please review the choices and adjust.
- Major tool upgrades (Vite, esbuild, TypeScript, React) may introduce breaking changes. The PR for upgrades includes a detailed list of old→new versions and code changes made to restore build.

---

## ✅ Verification checklist (PR/CI)
- npm ci
- npm run build
- npm start
- Manual smoke tests: homepage loads, chart rendering, orderbook updates, AI chatbot appears, no console errors

---

## 📄 License
Project is licensed under the MIT License — see [LICENSE](./LICENSE)

---

<p align="center">Dibuat dengan ❤️ untuk komunitas trader dan pengembang teknologi finansial.</p>
