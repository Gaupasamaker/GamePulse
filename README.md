# GamePulse 🎮📈

**GamePulse** is a professional Market Intelligence Dashboard specialized in the Gaming Industry. Built with **Next.js**, it provides real-time financial data, news aggregation, and portfolio simulation tools for investors and gamers.

![GamePulse App](https://via.placeholder.com/1200x600?text=GamePulse+Dashboard+Preview)

## ✨ Features

### 🏢 Real-Time Market Data
- Live quotes for major gaming companies (Sony, Nintendo, Nvidia, Microsoft, EA, etc.).
- Powered by **Yahoo Finance API** (via `yahoo-finance2`).
- Auto-refresh mechanism (Quotes: 60s, News: 5min).

### 🚀 Advanced Analytics [PRO]
- **Interactive Charts**: Intraday (15min), Short-term (1H), and Long-term trends.
- **Technical Indicators**: Toggleable **SMA 20** (Simple Moving Average) and **Volume** bars.
- **Market Briefing**: AI-driven daily narrative summary of market sentiment (Bullish/Bearish).

### 💼 Portfolio Simulator
- Track your virtual positions with automatic ROI calculation.
- **Smart Autofill**: Automatically fetches current market price when adding stocks.
- LocalStorage persistence (your data stays in your browser).

### ⚔️ Market Comparator
- Compare performance between two assets (e.g., `ATVI` vs `TTWO`) on a normalized percentage scale (0% base).

### 📅 Event Calendar
- **Earnings Calls**: Upcoming financial results.
- **Game Releases**: Major industry launches with impact estimation.

### 📱 PWA Ready (Mobile Support)
- Fully responsive design ("Mobile First").
- Installable on iOS/Android (Add to Home Screen) with native look & feel.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router).
- **Styling**: Tailwind CSS (Custom "Cyber-Terminal" aesthetic).
- **Charts**: Chart.js + React-Chartjs-2.
- **Data**: Yahoo Finance API.
- **Icons**: Lucide React.
- **Deployment**: Vercel ready.

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Gaupasamaker/GamePulse.git
    cd GamePulse
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  Deploy (No extra configuration needed).

## 📄 License

MIT License. Created for educational and business intelligence purposes.

---
*Built with ❤️ by Antigravity*
