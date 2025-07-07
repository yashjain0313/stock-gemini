# 🚀 Stock Helper Setup Guide

Your modern stock analysis app is ready! Here's how to get it running:

## ✅ What's Been Set Up

- **Next.js 15** with TypeScript and Tailwind CSS
- **Yahoo Finance API** integration for real-time stock data
- **Gemini AI** integration for stock analysis
- **Prisma + PostgreSQL** database schema
- **Beautiful UI** with responsive design
- **API Routes** for stock data and AI analysis

## 🔧 Next Steps to Get Running

### 1. Set Up Your API Keys

Edit `.env.local` and add your Gemini API key:

```bash
# Get your Gemini API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

### 2. Set Up Database (Choose One)

**Option A: Vercel Postgres (Recommended - Simple)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create a Postgres database
vercel postgres create stock-helper-db

# This will give you a DATABASE_URL - copy it to .env.local
```

**Option B: Local PostgreSQL**

```bash
# Install PostgreSQL locally
# Then update DATABASE_URL in .env.local:
DATABASE_URL="postgresql://username:password@localhost:5432/stock_helper"
```

### 3. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 🎯 How to Use

1. **Search Stocks**: Enter symbols like `RELIANCE.NS`, `TCS.NS`, etc.
2. **Quick Access**: Click on popular stock buttons
3. **AI Analysis**: Get 10-point analysis and buy/sell recommendations
4. **Real-time Data**: See live prices, changes, and volume

## 🔮 What's Coming Next

- **User Authentication** (NextAuth.js)
- **Watchlists** (save favorite stocks)
- **Price Alerts** (get notifications when targets hit)
- **Push Notifications** (PWA notifications on your phone)
- **Historical Charts** (price trends and patterns)

## 📱 Future Features (Phase 2)

- **PWA Support** (install as phone app)
- **Price Alert Notifications**
- **Watchlist Management**
- **Portfolio Tracking**
- **News Integration**

## 🆘 Troubleshooting

**Stock not found?**

- Make sure to use `.NS` for NSE stocks (e.g., `RELIANCE.NS`)
- Use `.BO` for BSE stocks

**AI analysis not working?**

- Check your `GEMINI_API_KEY` in `.env.local`
- Make sure you have API credits

**Database errors?**

- Run `npx prisma generate`
- Then `npx prisma migrate dev`

## 🎨 Customization

The app is built with:

- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Modular components** for easy customization

Happy trading! 📈✨
