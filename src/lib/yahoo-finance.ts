import axios from "axios";
import { StockData } from "@/types/stock";

// Yahoo Finance API endpoints
const YAHOO_FINANCE_API = "https://query1.finance.yahoo.com/v8/finance/chart/";
const YAHOO_SEARCH_API = "https://query1.finance.yahoo.com/v1/finance/search";

export class YahooFinanceService {
  /**
   * Get real-time stock data for a given symbol
   */
  static async getStockData(symbol: string): Promise<StockData | null> {
    try {
      const response = await axios.get(`${YAHOO_FINANCE_API}${symbol}`, {
        params: {
          interval: "1d",
          range: "1d",
        },
      });

      const result = response.data.chart.result[0];
      const meta = result.meta;
      const quote = result.indicators.quote[0];

      if (!meta || !quote) {
        throw new Error("Invalid data structure");
      }

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      return {
        symbol: meta.symbol,
        name: meta.longName || meta.shortName || symbol,
        price: currentPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap,
        previousClose: previousClose,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        exchange: meta.exchangeName || "NSE",
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Search for stocks by name or symbol
   */
  static async searchStocks(
    query: string
  ): Promise<{ symbol: string; name: string }[]> {
    try {
      const response = await axios.get(YAHOO_SEARCH_API, {
        params: {
          q: query,
          quotesCount: 10,
          newsCount: 0,
        },
      });

      const quotes = response.data.quotes || [];
      return quotes
        .filter(
          (quote: any) =>
            (quote.symbol.includes(".NS") || quote.symbol.includes(".BO")) &&
            quote.quoteType === "EQUITY"
        )
        .map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
        }));
    } catch (error) {
      console.error("Error searching stocks:", error);
      return [];
    }
  }

  /**
   * Get multiple stocks data at once
   */
  static async getMultipleStocks(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map((symbol) => this.getStockData(symbol));
    const results = await Promise.all(promises);
    return results.filter((stock): stock is StockData => stock !== null);
  }

  /**
   * Get historical data for charts (optional for future use)
   */
  static async getHistoricalData(symbol: string, period: string = "1mo") {
    try {
      const response = await axios.get(`${YAHOO_FINANCE_API}${symbol}`, {
        params: {
          interval: "1d",
          range: period,
        },
      });

      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const prices = result.indicators.quote[0].close;

      return timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000),
        price: prices[index],
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }
}
