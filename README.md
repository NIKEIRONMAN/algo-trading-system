<div align="center">

# 🤖 AI-Powered Algorithmic Trading System

<p align="center">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.1-FF6B35?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <strong>A full-stack paper trading platform that uses dual AI models (Groq LLaMA 3.1 + Google Gemini) to autonomously monitor live stock prices, make intelligent SELL/HOLD decisions, and send real-time email alerts.</strong>
</p>

<p align="center">
  <a href="https://algo-ai-trade.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀 Live Demo-algo--ai--trade.vercel.app-brightgreen?style=for-the-badge" />
  </a>
</p>

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [AI Decision Engine](#-ai-decision-engine)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)

---

## 🌟 Overview

The **AI-Powered Algorithmic Trading System** is a real-time paper trading simulator that bridges the gap between financial theory and AI automation. Users set up **smart trading conditions** for any stock — specifying their target profit % and maximum holding period — and the system autonomously monitors live prices, consults AI models for SELL/HOLD decisions, and triggers email notifications.

> **Paper Trading** means real market data with virtual money — zero financial risk, full learning experience.

---

## 🚀 Live Demo

🔗 **[https://algo-ai-trade.vercel.app/](https://algo-ai-trade.vercel.app/)**

- Frontend deployed on **Vercel**
- Backend deployed on **Render** (with keep-alive ping to prevent cold starts)
- Database hosted on **MongoDB Atlas**

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **Dual AI Engine** | Groq LLaMA 3.1 (primary) + Google Gemini 2.0 Flash (fallback) for SELL/HOLD decisions |
| 📈 **Live Stock Prices** | Real-time data via Yahoo Finance API with 5-min MongoDB caching layer |
| 📊 **Smart Conditions** | Set buy price, target profit %, and max holding days per stock |
| ⚙️ **Auto-Sell** | AI-triggered automatic trade closure when target price is reached |
| 📧 **Email Alerts** | Instant SELL alerts and DROP warnings (≥3% below buy price) via Nodemailer |
| 📅 **Daily Summary** | Automated 8 AM email digest with AI-generated market commentary per position |
| 💼 **Paper Trading** | Virtual ₹1,00,000 balance — Buy/Sell stocks with live FIFO P&L tracking |
| 🔐 **Auth System** | JWT authentication + Google OAuth 2.0 (Passport.js) |
| 📉 **Portfolio Dashboard** | Real-time P&L, open positions, trade history, and performance analytics |
| 📡 **Watchlist** | Add/track stocks with live price feeds and % change |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vercel)                       │
│          React 19 + Vite + Recharts + Framer Motion          │
│   Dashboard │ Portfolio │ Trades │ Conditions │ Watchlist   │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JWT)
┌──────────────────────────▼──────────────────────────────────┐
│                    BACKEND (Render)                          │
│                  Node.js + Express 5                         │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Auth Routes │  │ Trade Routes │  │ Condition Routes  │  │
│  │  Stock Routes│  │ Alert Routes │  │ Portfolio Routes  │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             CRON JOB — Every 5 Minutes               │   │
│  │  Fetch Prices → AI Analysis → Auto-Sell → Email      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────┬───────────────────────┘
               │                      │
┌──────────────▼──────┐  ┌────────────▼────────────────────┐
│  MongoDB Atlas      │  │     External Services           │
│  • Users            │  │  • Yahoo Finance API (prices)   │
│  • Conditions       │  │  • Groq API (LLaMA 3.1)         │
│  • Trades           │  │  • Google Gemini 2.0 Flash      │
│  • Alerts           │  │  • Nodemailer (Gmail SMTP)      │
│  • Portfolio        │  │  • Google OAuth 2.0             │
│  • StockCache       │  └─────────────────────────────────┘
│  • PriceHistory     │
└─────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **Vite** | 8.x | Build tool & dev server |
| **React Router DOM** | 7.x | Client-side routing |
| **Recharts** | 3.x | Interactive stock charts |
| **Framer Motion** | 12.x | Smooth animations & transitions |
| **Lucide React** | 1.x | Icon library |
| **Axios** | 1.x | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | 5.x | REST API server |
| **MongoDB + Mongoose** | 9.x | Database & ODM |
| **node-cron** | 4.x | Scheduled price monitoring jobs |
| **Passport.js** | 0.7.x | Google OAuth 2.0 authentication |
| **JWT (jsonwebtoken)** | 9.x | Stateless auth tokens |
| **bcryptjs** | 3.x | Password hashing |
| **Nodemailer** | 8.x | Transactional email delivery |
| **Axios** | 1.x | Yahoo Finance API calls |
| **dotenv** | 17.x | Environment config |

### AI & Data
| Service | Role |
|---|---|
| **Groq (LLaMA 3.1-8b-instant)** | Primary AI — fast SELL/HOLD decisions |
| **Google Gemini 2.0 Flash Lite** | Fallback AI — fires when Groq fails |
| **Yahoo Finance API** | Real-time stock price data |
| **Rule-Based Engine** | Final fallback if both AIs fail |

---

## 🤖 AI Decision Engine

The system uses a **3-tier fallback AI architecture** for maximum reliability:

```
Price reaches Target?
        │
        ▼
  ┌─────────────┐    ✅ Success     ┌──────────────────┐
  │  Groq API   │ ──────────────►  │  SELL / HOLD     │
  │ LLaMA 3.1   │                  │  with confidence │
  └─────────────┘                  └──────────────────┘
        │ ❌ Fails
        ▼
  ┌─────────────┐    ✅ Success     ┌──────────────────┐
  │   Gemini    │ ──────────────►  │  SELL / HOLD     │
  │  2.0 Flash  │                  │  with confidence │
  └─────────────┘                  └──────────────────┘
        │ ❌ Fails
        ▼
  ┌─────────────────────────────┐
  │  Rule-Based Fallback        │
  │  price >= target → SELL     │
  │  price <  target → HOLD     │
  └─────────────────────────────┘
```

Each AI response includes:
- **`action`**: `SELL` or `HOLD`
- **`reason`**: One-sentence explanation
- **`confidence`**: `HIGH` / `MEDIUM` / `LOW`
- **`riskLevel`**: `HIGH` / `MEDIUM` / `LOW`

---

## ⚙️ How It Works

### Condition Lifecycle

```
  [User Creates Condition]
          │
          ▼
       PENDING  ──── Waiting for market price to reach buyPrice
          │
          │  currentPrice >= buyPrice
          ▼
        ACTIVE  ──── Monitoring for target sell price & drops
          │
          ├──── currentPrice >= targetSellPrice ──► AI Analysis
          │                                            │
          │                                     SELL ──► COMPLETED ──► Email Alert
          │                                     HOLD ──► Keep monitoring
          │
          ├──── currentPrice dropped ≥3% below buyPrice ──► DROP Alert Email
          │
          └──── maxDays exceeded ──────────────► EXPIRED
```

### Price Monitor Cron Job (Every 5 Minutes)
1. Fetches all `PENDING` / `ACTIVE` conditions from MongoDB
2. Gets live prices for unique symbols (via cache or Yahoo Finance)
3. For each condition:
   - **PENDING → ACTIVE** when price hits buy price
   - **Expiry Check** — marks EXPIRED if `maxDays` exceeded
   - **Profit Check** — calls AI if price ≥ target sell price
   - **Drop Alert** — sends email if price drops ≥3% below buy price
4. Auto-Sell closes the linked trade and updates portfolio balance

### Daily Summary (8:00 AM every day)
- Groups all active conditions by user
- Gets AI market commentary per stock via `getMarketSummary()`
- Sends a formatted portfolio digest email to each user

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register with email + password |
| `POST` | `/login` | Login, returns JWT token |
| `GET` | `/google` | Google OAuth redirect |
| `GET` | `/google/callback` | OAuth callback handler |
| `GET` | `/me` | Get current user profile |

### Stocks — `/api/stocks`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/price/:symbol` | Live price for a stock symbol |
| `GET` | `/search?q=query` | Search stocks by name/symbol |

### Conditions — `/api/conditions`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | All conditions for logged-in user |
| `POST` | `/` | Create a new trading condition |
| `GET` | `/:id` | Get single condition details |
| `PATCH` | `/:id` | Update condition (e.g. toggle autoSell) |
| `DELETE` | `/:id` | Cancel/delete a condition |

### Trades — `/api/trades`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/buy` | Paper-buy a stock (deducts virtual balance) |
| `POST` | `/sell` | Paper-sell with FIFO P&L calculation |
| `GET` | `/` | All trade history |
| `GET` | `/open` | Open positions with live P&L |
| `GET` | `/:id` | Single trade detail |

### Portfolio — `/api/portfolio`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Portfolio summary (balance, P&L, invested) |
| `POST` | `/deposit` | Add virtual funds |

### Alerts — `/api/alerts`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | All alerts (SELL + DROP) for user |
| `DELETE` | `/:id` | Clear a specific alert |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/summary` | Overview stats (conditions, trades, P&L) |

### Charts — `/api/charts`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:symbol/history` | Historical OHLCV price data |

---

## 🗄 Database Schema

### `User`
```js
{ name, email, passwordHash, googleId, createdAt }
```

### `Condition` — Core trading strategy unit
```js
{
  user, symbol,
  buyPrice,              // entry price target
  targetProfitPercent,   // e.g. 5 = sell at +5%
  maxDays,               // auto-expire after N days
  status,                // PENDING | ACTIVE | COMPLETED | EXPIRED | CANCELLED
  autoSell,              // true = auto-close linked trade
  activatedAt,           // when buyPrice was first hit
  completedAt,           // when target was hit
  lastCheckedPrice,      // last price seen by cron
  dropAlertSent,         // prevents duplicate drop alerts
  aiNote,                // AI's SELL/HOLD reason
  // Virtuals:
  targetSellPrice,       // buyPrice * (1 + targetProfitPercent/100)
  expiresAt              // createdAt + maxDays
}
```

### `Trade`
```js
{
  user, symbol, companyName,
  type,          // BUY | SELL
  status,        // OPEN | CLOSED
  quantity, price, totalAmount, currency,
  buyPrice,      // average buy price (for SELL trades)
  profitLoss, profitLossPercent,
  openedAt, closedAt
}
```

### `Alert`
```js
{
  user, condition, symbol,
  alertType,     // SELL | DROP
  triggerPrice, profitPercent, aiNote,
  emailSent, sentAt
}
```

### `Portfolio`
```js
{ user, virtualBalance, totalInvested }
```

### `StockCache`
```js
{ symbol, price, previousClose, change, percentChange, volume, marketCap, currency, exchange, fetchedAt, hitCount }
```

---

## 📁 Project Structure

```
miniproject26/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Overview: stats, conditions, alerts
│   │   │   ├── Trade.jsx       # Paper buy/sell interface
│   │   │   ├── Portfolio.jsx   # Balance, open positions, history
│   │   │   ├── ConditionSetup.jsx  # Create & manage conditions
│   │   │   ├── Watchlist.jsx   # Live stock watchlist
│   │   │   ├── AlertHistory.jsx    # SELL & DROP alert log
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── components/         # Reusable UI components
│   │   ├── services/           # Axios API wrappers
│   │   └── utils/              # Helpers & formatters
│   └── vercel.json
│
└── server/                     # Node.js + Express backend
    ├── server.js               # App entry point, middleware, DB connect
    ├── config/
    │   └── passport.js         # Google OAuth 2.0 strategy
    ├── middleware/
    │   └── authMiddleware.js   # JWT protect() guard
    ├── models/
    │   ├── User.js
    │   ├── Condition.js        # Core trading condition schema
    │   ├── Trade.js
    │   ├── Alert.js
    │   ├── Portfolio.js
    │   ├── StockCache.js       # MongoDB-backed price cache
    │   ├── PriceHistory.js
    │   └── Watchlist.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── stockRoutes.js
    │   ├── conditionRoutes.js
    │   ├── tradeRoutes.js
    │   ├── alertRoutes.js
    │   ├── portfolioRoutes.js
    │   ├── dashboardRoutes.js
    │   └── chartRoutes.js
    ├── services/
    │   ├── geminiService.js    # Groq + Gemini AI with fallback logic
    │   ├── stockService.js     # Yahoo Finance + MongoDB cache
    │   └── emailService.js     # Nodemailer — SELL/DROP/Daily emails
    └── jobs/
        └── priceMonitor.js     # Main cron: price check + AI + auto-sell
```

---

## 🔑 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/trading

# Auth
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# Email (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Deployment
FRONTEND_URL=http://localhost:5174
RENDER=true                      # enables keep-alive ping
RENDER_EXTERNAL_URL=https://your-app.onrender.com
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))
- Gmail App Password for email alerts

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/bhumikaagarwal09/AI-Powered-Algorithmic-Trading-System-Mini-Project-.git
cd AI-Powered-Algorithmic-Trading-System-Mini-Project-
```

**2. Setup Backend**
```bash
cd server
npm install
# Create .env file and fill in all variables (see above)
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

**4. Open in browser**
```
Frontend: http://localhost:5174
Backend:  http://localhost:5000
```

---

## 👨‍💻 Team

Built as a Mini Project for B.Tech — AI/ML Engineering.

---

<div align="center">

**⭐ If you found this project useful, give it a star!**

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-algo--ai--trade.vercel.app-blue?style=for-the-badge)](https://algo-ai-trade.vercel.app/)

</div>
