import { NextRequest, NextResponse } from "next/server";

// Extended list of Indian stocks for search
const INDIAN_STOCKS = [
  // Nifty 50 stocks
  {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries Ltd",
    sector: "Oil & Gas",
  },
  { symbol: "TCS.NS", name: "Tata Consultancy Services Ltd", sector: "IT" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd", sector: "Banking" },
  { symbol: "INFY.NS", name: "Infosys Ltd", sector: "IT" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank Ltd", sector: "Banking" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever Ltd", sector: "FMCG" },
  { symbol: "ITC.NS", name: "ITC Ltd", sector: "FMCG" },
  { symbol: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Ltd", sector: "Telecom" },
  {
    symbol: "KOTAKBANK.NS",
    name: "Kotak Mahindra Bank Ltd",
    sector: "Banking",
  },
  { symbol: "LT.NS", name: "Larsen & Toubro Ltd", sector: "Construction" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints Ltd", sector: "Paints" },
  {
    symbol: "MARUTI.NS",
    name: "Maruti Suzuki India Ltd",
    sector: "Automobile",
  },
  { symbol: "HCLTECH.NS", name: "HCL Technologies Ltd", sector: "IT" },
  { symbol: "AXISBANK.NS", name: "Axis Bank Ltd", sector: "Banking" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance Ltd", sector: "NBFC" },
  { symbol: "WIPRO.NS", name: "Wipro Ltd", sector: "IT" },
  { symbol: "NESTLEIND.NS", name: "Nestle India Ltd", sector: "FMCG" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement Ltd", sector: "Cement" },
  { symbol: "TITAN.NS", name: "Titan Company Ltd", sector: "Jewellery" },
  {
    symbol: "SUNPHARMA.NS",
    name: "Sun Pharmaceutical Industries Ltd",
    sector: "Pharma",
  },
  {
    symbol: "ONGC.NS",
    name: "Oil & Natural Gas Corporation Ltd",
    sector: "Oil & Gas",
  },
  { symbol: "NTPC.NS", name: "NTPC Ltd", sector: "Power" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel Ltd", sector: "Steel" },
  {
    symbol: "POWERGRID.NS",
    name: "Power Grid Corporation of India Ltd",
    sector: "Power",
  },
  {
    symbol: "BAJAJFINSV.NS",
    name: "Bajaj Finserv Ltd",
    sector: "Financial Services",
  },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra Ltd", sector: "Automobile" },
  { symbol: "TECHM.NS", name: "Tech Mahindra Ltd", sector: "IT" },
  {
    symbol: "HDFCLIFE.NS",
    name: "HDFC Life Insurance Company Ltd",
    sector: "Insurance",
  },
  {
    symbol: "SBILIFE.NS",
    name: "SBI Life Insurance Company Ltd",
    sector: "Insurance",
  },
  { symbol: "COALINDIA.NS", name: "Coal India Ltd", sector: "Mining" },
  {
    symbol: "DRREDDY.NS",
    name: "Dr. Reddys Laboratories Ltd",
    sector: "Pharma",
  },
  { symbol: "CIPLA.NS", name: "Cipla Ltd", sector: "Pharma" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors Ltd", sector: "Automobile" },
  {
    symbol: "BPCL.NS",
    name: "Bharat Petroleum Corporation Ltd",
    sector: "Oil & Gas",
  },
  { symbol: "DIVISLAB.NS", name: "Divis Laboratories Ltd", sector: "Pharma" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd", sector: "Automobile" },
  { symbol: "GRASIM.NS", name: "Grasim Industries Ltd", sector: "Cement" },
  {
    symbol: "APOLLOHOSP.NS",
    name: "Apollo Hospitals Enterprise Ltd",
    sector: "Healthcare",
  },
  {
    symbol: "ADANIPORTS.NS",
    name: "Adani Ports and Special Economic Zone Ltd",
    sector: "Infrastructure",
  },

  // Popular mid-cap stocks
  { symbol: "ZOMATO.NS", name: "Zomato Ltd", sector: "Food Delivery" },
  { symbol: "PAYTM.NS", name: "One 97 Communications Ltd", sector: "Fintech" },
  {
    symbol: "NYKAA.NS",
    name: "FSN E-Commerce Ventures Ltd",
    sector: "E-commerce",
  },
  { symbol: "POLICYBZR.NS", name: "PB Fintech Ltd", sector: "Fintech" },
  {
    symbol: "IRCTC.NS",
    name: "Indian Railway Catering And Tourism Corporation Ltd",
    sector: "Travel",
  },
  { symbol: "DMART.NS", name: "Avenue Supermarts Ltd", sector: "Retail" },
  {
    symbol: "PIDILITIND.NS",
    name: "Pidilite Industries Ltd",
    sector: "Chemicals",
  },
  {
    symbol: "GODREJCP.NS",
    name: "Godrej Consumer Products Ltd",
    sector: "FMCG",
  },
  { symbol: "MARICO.NS", name: "Marico Ltd", sector: "FMCG" },
  { symbol: "DABUR.NS", name: "Dabur India Ltd", sector: "FMCG" },

  // Power sector stocks
  {
    symbol: "JPOWER.NS",
    name: "Jaiprakash Power Ventures Ltd",
    sector: "Power",
  },
  {
    symbol: "JPPOWER.NS",
    name: "Jaiprakash Power Ventures Ltd",
    sector: "Power",
  },
  { symbol: "TATAPOWER.NS", name: "Tata Power Company Ltd", sector: "Power" },
  { symbol: "ADANIPOWER.NS", name: "Adani Power Ltd", sector: "Power" },
  { symbol: "NHPC.NS", name: "NHPC Ltd", sector: "Power" },
  { symbol: "SJVN.NS", name: "SJVN Ltd", sector: "Power" },
  {
    symbol: "PFC.NS",
    name: "Power Finance Corporation Ltd",
    sector: "Power Finance",
  },
  { symbol: "RECLTD.NS", name: "REC Ltd", sector: "Power Finance" },

  // Retail & Fashion
  { symbol: "TRENT.NS", name: "Trent Ltd", sector: "Fashion Retail" },
  {
    symbol: "ADITYADIRGA.NS",
    name: "Aditya Birla Fashion and Retail Ltd",
    sector: "Fashion Retail",
  },
  {
    symbol: "SHOPERSTOP.NS",
    name: "Shoppers Stop Ltd",
    sector: "Retail",
  },
  { symbol: "VMART.NS", name: "V-Mart Retail Ltd", sector: "Retail" },

  // Automobile sector
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto Ltd", sector: "Automobile" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp Ltd", sector: "Automobile" },
  { symbol: "TVSMOTORS.NS", name: "TVS Motor Company Ltd", sector: "Automobile" },
  { symbol: "ASHOKLEY.NS", name: "Ashok Leyland Ltd", sector: "Automobile" },
  { symbol: "ESCORTS.NS", name: "Escorts Ltd", sector: "Automobile" },
  { symbol: "BOSCHLTD.NS", name: "Bosch Ltd", sector: "Auto Components" },
  { symbol: "MOTHERSON.NS", name: "Motherson Sumi Systems Ltd", sector: "Auto Components" },

  // IT & Technology
  { symbol: "LTIM.NS", name: "LTIMindtree Ltd", sector: "IT" },
  { symbol: "PERSISTENT.NS", name: "Persistent Systems Ltd", sector: "IT" },
  { symbol: "MPHASIS.NS", name: "Mphasis Ltd", sector: "IT" },
  { symbol: "COFORGE.NS", name: "Coforge Ltd", sector: "IT" },
  { symbol: "LTTS.NS", name: "L&T Technology Services Ltd", sector: "IT" },

  // Banking & Finance
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank Ltd", sector: "Banking" },
  { symbol: "FEDERALBNK.NS", name: "Federal Bank Ltd", sector: "Banking" },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank Ltd", sector: "Banking" },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank Ltd", sector: "Banking" },
  { symbol: "PNB.NS", name: "Punjab National Bank", sector: "Banking" },
  { symbol: "CANBK.NS", name: "Canara Bank", sector: "Banking" },
  { symbol: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking" },
  { symbol: "IOB.NS", name: "Indian Overseas Bank", sector: "Banking" },

  // NBFC & Financial Services
  { symbol: "BAJAJHLDNG.NS", name: "Bajaj Holdings & Investment Ltd", sector: "Financial Services" },
  { symbol: "CHOLAFIN.NS", name: "Cholamandalam Investment and Finance Company Ltd", sector: "NBFC" },
  { symbol: "MUTHOOTFIN.NS", name: "Muthoot Finance Ltd", sector: "NBFC" },
  { symbol: "MANAPPURAM.NS", name: "Manappuram Finance Ltd", sector: "NBFC" },
  { symbol: "LICI.NS", name: "Life Insurance Corporation of India", sector: "Insurance" },

  // Pharma & Healthcare
  { symbol: "BIOCON.NS", name: "Biocon Ltd", sector: "Pharma" },
  { symbol: "LUPIN.NS", name: "Lupin Ltd", sector: "Pharma" },
  { symbol: "AUROPHARMA.NS", name: "Aurobindo Pharma Ltd", sector: "Pharma" },
  { symbol: "TORNTPHARM.NS", name: "Torrent Pharmaceuticals Ltd", sector: "Pharma" },
  { symbol: "ALKEM.NS", name: "Alkem Laboratories Ltd", sector: "Pharma" },
  { symbol: "GLAND.NS", name: "Gland Pharma Ltd", sector: "Pharma" },

  // Metals & Mining
  { symbol: "HINDALCO.NS", name: "Hindalco Industries Ltd", sector: "Metals" },
  { symbol: "JINDALSTEL.NS", name: "Jindal Steel & Power Ltd", sector: "Steel" },
  { symbol: "SAIL.NS", name: "Steel Authority of India Ltd", sector: "Steel" },
  { symbol: "NMDC.NS", name: "NMDC Ltd", sector: "Mining" },
  { symbol: "MOIL.NS", name: "MOIL Ltd", sector: "Mining" },
  { symbol: "VEDL.NS", name: "Vedanta Ltd", sector: "Metals & Mining" },

  // Chemicals & Fertilizers
  { symbol: "UPL.NS", name: "UPL Ltd", sector: "Chemicals" },
  { symbol: "SRF.NS", name: "SRF Ltd", sector: "Chemicals" },
  { symbol: "AARTI.NS", name: "Aarti Industries Ltd", sector: "Chemicals" },
  { symbol: "BALRAMCHIN.NS", name: "Balrampur Chini Mills Ltd", sector: "Sugar" },
  { symbol: "CHAMBLFERT.NS", name: "Chambal Fertilisers and Chemicals Ltd", sector: "Fertilizers" },

  // Telecom & Media
  { symbol: "IDEA.NS", name: "Vodafone Idea Ltd", sector: "Telecom" },
  { symbol: "HATHWAY.NS", name: "Hathway Cable & Datacom Ltd", sector: "Media" },
  { symbol: "SUNTV.NS", name: "Sun TV Network Ltd", sector: "Media" },
  { symbol: "ZEEL.NS", name: "Zee Entertainment Enterprises Ltd", sector: "Media" },

  // Real Estate
  { symbol: "DLF.NS", name: "DLF Ltd", sector: "Real Estate" },
  { symbol: "GODREJPROP.NS", name: "Godrej Properties Ltd", sector: "Real Estate" },
  { symbol: "OBEROIRLTY.NS", name: "Oberoi Realty Ltd", sector: "Real Estate" },
  { symbol: "PRESTIGE.NS", name: "Prestige Estates Projects Ltd", sector: "Real Estate" },

  // Consumer Goods
  { symbol: "BRITANNIA.NS", name: "Britannia Industries Ltd", sector: "FMCG" },
  { symbol: "COLPAL.NS", name: "Colgate Palmolive (India) Ltd", sector: "FMCG" },
  { symbol: "VBL.NS", name: "Varun Beverages Ltd", sector: "Beverages" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer Products Ltd", sector: "FMCG" },
  { symbol: "JUBLFOOD.NS", name: "Jubilant FoodWorks Ltd", sector: "Food" },

  // Additional popular stocks
  {
    symbol: "ADANIENTERPRISES.NS",
    name: "Adani Enterprises Ltd",
    sector: "Diversified",
  },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel Ltd", sector: "Steel" },
  { symbol: "IOC.NS", name: "Indian Oil Corporation Ltd", sector: "Oil & Gas" },
  
  // Small Cap & Emerging stocks
  { symbol: "RPOWER.NS", name: "Reliance Power Ltd", sector: "Power" },
  { symbol: "SUZLON.NS", name: "Suzlon Energy Ltd", sector: "Renewable Energy" },
  { symbol: "YES.NS", name: "Yes Bank Ltd", sector: "Banking" },
  { symbol: "DELTACORP.NS", name: "Delta Corp Ltd", sector: "Gaming" },
  { symbol: "INDIAMART.NS", name: "IndiaMART InterMESH Ltd", sector: "B2B E-commerce" },
  { symbol: "NAUKRI.NS", name: "Info Edge (India) Ltd", sector: "Internet" },
  { symbol: "JUSTDIAL.NS", name: "Just Dial Ltd", sector: "Internet" },
  
  // Aviation & Transportation
  { symbol: "INDIGO.NS", name: "InterGlobe Aviation Ltd", sector: "Aviation" },
  { symbol: "SPICEJET.NS", name: "SpiceJet Ltd", sector: "Aviation" },
  { symbol: "CONCOR.NS", name: "Container Corporation of India Ltd", sector: "Logistics" },
  
  // PSU Banks
  { symbol: "IOB.NS", name: "Indian Overseas Bank", sector: "Banking" },
  { symbol: "CENTRALBK.NS", name: "Central Bank of India", sector: "Banking" },
  { symbol: "UNIONBANK.NS", name: "Union Bank of India", sector: "Banking" },
  
  // Textile & Apparel
  { symbol: "RTNPOWER.NS", name: "Rattanindia Power Ltd", sector: "Power" },
  { symbol: "WELCORP.NS", name: "Welspun Corp Ltd", sector: "Textile" },
  { symbol: "ARVIND.NS", name: "Arvind Ltd", sector: "Textile" },
  
  // Infrastructure & Construction
  { symbol: "IRB.NS", name: "IRB Infrastructure Developers Ltd", sector: "Infrastructure" },
  { symbol: "GMRINFRA.NS", name: "GMR Infrastructure Ltd", sector: "Infrastructure" },
  { symbol: "JPASSOCIAT.NS", name: "Jaiprakash Associates Ltd", sector: "Construction" },
  
  // Food & Agriculture
  { symbol: "KRBL.NS", name: "KRBL Ltd", sector: "Food Processing" },
  { symbol: "DABUR.NS", name: "Dabur India Ltd", sector: "FMCG" },
  { symbol: "EMAMILTD.NS", name: "Emami Ltd", sector: "FMCG" },
  
  // Technology & Software
  { symbol: "MINDTREE.NS", name: "Mindtree Ltd", sector: "IT" },
  { symbol: "RCOM.NS", name: "Reliance Communications Ltd", sector: "Telecom" },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }

    const searchTerm = query.toLowerCase();
    
    // First, search in our local database for popular stocks
    const localResults = INDIAN_STOCKS
      .filter(stock => 
        stock.name.toLowerCase().includes(searchTerm) ||
        stock.symbol.toLowerCase().includes(searchTerm) ||
        stock.sector.toLowerCase().includes(searchTerm)
      )
      .slice(0, 5) // Get top 5 from local
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector
      }));

    // If we have enough local results, return them
    if (localResults.length >= 3) {
      return NextResponse.json(localResults);
    }

    // Otherwise, search Yahoo Finance for more comprehensive results
    try {
      const yahooResults = await searchYahooFinance(query);
      
      // Combine local and Yahoo results, remove duplicates
      const allResults = [...localResults];
      const existingSymbols = new Set(localResults.map(r => r.symbol));
      
      yahooResults.forEach((result: any) => {
        if (!existingSymbols.has(result.symbol) && allResults.length < 8) {
          allResults.push(result);
        }
      });
      
      return NextResponse.json(allResults);
    } catch (error) {
      console.error('Yahoo Finance search failed, using local results:', error);
      return NextResponse.json(localResults);
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Yahoo Finance search function for comprehensive stock search
async function searchYahooFinance(query: string) {
  try {
    // Add common Indian stock exchanges to improve search
    const searchQuery = `${query} india stock NSE BSE`;
    const response = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(searchQuery)}&quotesCount=15&newsCount=0`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }
    
    const data = await response.json();
    const quotes = data.quotes || [];
    
    return quotes
      .filter((quote: any) => {
        // Filter for Indian stocks (NSE/BSE) and equity type
        const isIndianStock = quote.symbol && (
          quote.symbol.includes('.NS') || 
          quote.symbol.includes('.BO') ||
          quote.exchange === 'NSI' ||
          quote.exchange === 'BSE'
        );
        const isEquity = quote.quoteType === 'EQUITY';
        const hasValidName = quote.longname || quote.shortname;
        
        return isIndianStock && isEquity && hasValidName;
      })
      .map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname || quote.symbol,
        sector: quote.sector || quote.industry || 'Others'
      }))
      .slice(0, 10); // Limit results
  } catch (error) {
    console.error('Yahoo Finance search error:', error);
    return [];
  }
}
