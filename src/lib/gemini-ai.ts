import { GoogleGenerativeAI } from "@google/generative-ai";
import { StockData, StockAnalysis } from "@/types/stock";

export class GeminiAnalysisService {
  private static genAI: GoogleGenerativeAI;

  static initialize() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required");
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  /**
   * Generate comprehensive stock analysis using Gemini
   */
  static async analyzeStock(stockData: StockData): Promise<StockAnalysis> {
    if (!this.genAI) {
      this.initialize();
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following Indian stock and provide a comprehensive investment analysis based on RECENT data:

    Stock: ${stockData.name} (${stockData.symbol})
    Current Price: ₹${stockData.price}
    Change: ₹${stockData.change} (${stockData.changePercent}%)
    Volume: ${stockData.volume}
    Day High: ₹${stockData.dayHigh}
    Day Low: ₹${stockData.dayLow}
    Previous Close: ₹${stockData.previousClose}

    IMPORTANT: Focus ONLY on:
    - News from the LAST 7 DAYS (January 2025)
    - Upcoming events in next 3 months (Q4 FY24 results, upcoming quarters)
    - Recent market movements and trends
    - Current sector performance
    - Recent company announcements

    Provide:
    1. **10 Key Analysis Points** - Focus on recent developments, news from last week, upcoming earnings/events
    2. **Investment Recommendation** - BUY/SELL/HOLD with confidence percentage (0-100)
    3. **Risk Assessment** - LOW/MEDIUM/HIGH risk level
    4. **Target Price** - Based on recent performance and upcoming events
    5. **Key Reasoning** - Focus on recent catalysts and upcoming events

    Format your response as JSON:
    {
      "analysis": ["Recent point 1", "Recent point 2", ... "Recent point 10"],
      "sentiment": "BUY|SELL|HOLD",
      "confidence": 85,
      "riskLevel": "LOW|MEDIUM|HIGH",
      "targetPrice": 1500,
      "reasoning": "Brief explanation focusing on recent events",
      "timeHorizon": "3-6 months"
    }

    Focus on: Recent earnings, upcoming results, recent news, current market sentiment, recent price action.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format from Gemini");
      }

      const analysisData = JSON.parse(jsonMatch[0]);

      return {
        symbol: stockData.symbol,
        price: stockData.price,
        analysis: analysisData.analysis || [],
        sentiment: analysisData.sentiment || "HOLD",
        confidence: analysisData.confidence || 50,
        reasoning: analysisData.reasoning || "Analysis pending",
        riskLevel: analysisData.riskLevel || "MEDIUM",
        targetPrice: analysisData.targetPrice,
        timeHorizon: analysisData.timeHorizon || "3-6 months",
      };
    } catch (error) {
      console.error("Error analyzing stock with Gemini:", error);

      // Fallback analysis
      return {
        symbol: stockData.symbol,
        price: stockData.price,
        analysis: [
          "Analysis service temporarily unavailable",
          "Please try again later",
        ],
        sentiment: "HOLD",
        confidence: 0,
        reasoning: "Unable to generate analysis at this time",
        riskLevel: "MEDIUM",
      };
    }
  }

  /**
   * Get quick market sentiment for multiple stocks
   */
  static async getBatchSentiment(
    stocks: StockData[]
  ): Promise<{ symbol: string; sentiment: string; confidence: number }[]> {
    if (!this.genAI) {
      this.initialize();
    }

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const stocksList = stocks
      .map(
        (stock) =>
          `${stock.symbol}: ₹${stock.price} (${
            stock.changePercent >= 0 ? "+" : ""
          }${stock.changePercent}%)`
      )
      .join("\n");

    const prompt = `
    Provide quick sentiment analysis for these Indian stocks:
    ${stocksList}

    For each stock, give BUY/SELL/HOLD recommendation with confidence (0-100).
    
    Response format:
    [
      {"symbol": "RELIANCE.NS", "sentiment": "BUY", "confidence": 75},
      {"symbol": "TCS.NS", "sentiment": "HOLD", "confidence": 60}
    ]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return stocks.map((stock) => ({
        symbol: stock.symbol,
        sentiment: "HOLD",
        confidence: 50,
      }));
    } catch (error) {
      console.error("Error getting batch sentiment:", error);
      return stocks.map((stock) => ({
        symbol: stock.symbol,
        sentiment: "HOLD",
        confidence: 50,
      }));
    }
  }
}
