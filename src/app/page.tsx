"use client";

import { useState, useEffect, useRef } from "react";
import { StockData } from "@/types/stock";
import { POPULAR_STOCKS } from "@/types/stock";

interface SearchResult {
  symbol: string;
  name: string;
  sector: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live search functionality
  useEffect(() => {
    const searchStocks = async () => {
      if (searchQuery.length < 1) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const results = await response.json();
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (symbol: string) => {
    setLoading(true);
    setError("");
    setShowDropdown(false);

    try {
      // Fetch stock data
      const stockResponse = await fetch(`/api/stock/${symbol}`);
      if (!stockResponse.ok) throw new Error("Stock not found");

      const stock = await stockResponse.json();
      setStockData(stock);

      // Fetch AI analysis
      const analysisResponse = await fetch(`/api/analysis/${symbol}`);
      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchQuery(result.symbol);
    setShowDropdown(false);
    handleSearch(result.symbol);
  };

  const handleQuickStock = (symbol: string) => {
    setSearchQuery(symbol);
    handleSearch(symbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            📈 Stock Helper
          </h1>
          <p className="text-black font-medium">
            Get real-time stock data and AI-powered analysis for Indian stocks
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative" ref={searchRef}>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search stocks by name or symbol (e.g., Reliance, TCS, HDFC)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      searchQuery &&
                      handleSearch(searchQuery)
                    }
                    onFocus={() =>
                      searchResults.length > 0 && setShowDropdown(true)
                    }
                  />

                  {/* Search Dropdown */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-80 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <div
                          key={result.symbol}
                          onClick={() => handleSearchResultClick(result)}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-base leading-tight">
                                {result.name}
                              </div>
                              <div className="text-sm text-gray-700 font-medium mt-1">
                                {result.symbol}
                              </div>
                            </div>
                            <div className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-semibold ml-2 whitespace-nowrap">
                              {result.sector}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => searchQuery && handleSearch(searchQuery)}
                  disabled={loading || !searchQuery}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "🔄" : "🔍"}
                </button>
              </div>
            </div>

            {/* Popular Stocks */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-2">
                Popular Stocks:
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_STOCKS.slice(0, 6).map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleQuickStock(stock.symbol)}
                    className="px-3 py-1 text-xs text-black bg-gray-100 hover:bg-blue-100 hover:text-blue-800 rounded-full transition-colors font-medium"
                  >
                    {stock.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Stock Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-black mb-4">
                {stockData.name}
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black font-medium">Symbol:</span>
                  <span className="font-semibold text-black">{stockData.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-medium">Current Price:</span>
                  <span className="font-bold text-2xl text-black">₹{stockData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-medium">Change:</span>
                  <span
                    className={`font-semibold ${
                      stockData.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stockData.change >= 0 ? "+" : ""}₹{stockData.change} (
                    {stockData.changePercent}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-medium">Volume:</span>
                  <span className="text-black font-semibold">{stockData.volume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black font-medium">Day Range:</span>
                  <span className="text-black font-semibold">
                    ₹{stockData.dayLow} - ₹{stockData.dayHigh}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Analysis Card */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-black mb-4">
                  🤖 AI Analysis
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-medium">Recommendation:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        analysis.sentiment === "BUY"
                          ? "bg-green-100 text-green-800"
                          : analysis.sentiment === "SELL"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {analysis.sentiment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black font-medium">Confidence:</span>
                    <span className="font-semibold text-black">
                      {analysis.confidence}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black font-medium">Risk Level:</span>
                    <span
                      className={`font-semibold ${
                        analysis.riskLevel === "LOW"
                          ? "text-green-600"
                          : analysis.riskLevel === "HIGH"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {analysis.riskLevel}
                    </span>
                  </div>
                  {analysis.targetPrice && (
                    <div className="flex justify-between">
                      <span className="text-black font-medium">Target Price:</span>
                      <span className="font-semibold text-black">
                        ₹{analysis.targetPrice}
                      </span>
                    </div>
                  )}

                  {/* Analysis Points */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-black mb-2">
                      Key Analysis Points:
                    </h3>
                    <ul className="space-y-1 text-sm text-black">
                      {analysis.analysis.map((point: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-black font-medium">Fetching stock data and analysis...</p>
          </div>
        )}
      </div>
    </div>
  );
}
