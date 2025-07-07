import { NextRequest, NextResponse } from "next/server";
import { YahooFinanceService } from "@/lib/yahoo-finance";
import { GeminiAnalysisService } from "@/lib/gemini-ai";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    // First get stock data
    const stockData = await YahooFinanceService.getStockData(symbol);

    if (!stockData) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    // Then get AI analysis
    const analysis = await GeminiAnalysisService.analyzeStock(stockData);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
