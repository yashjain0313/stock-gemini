// Stock data types from Yahoo Finance API
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  exchange: string;
}

// Gemini analysis response
export interface StockAnalysis {
  symbol: string;
  price: number;
  analysis: string[];
  sentiment: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  targetPrice?: number;
  timeHorizon?: string;
}

// Price alert types
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  alertType: "ABOVE" | "BELOW";
  isActive: boolean;
  createdAt: Date;
}

// Watchlist item
export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  addedAt: Date;
}

// Popular Indian stocks for quick access
export const POPULAR_STOCKS = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
] as const;
