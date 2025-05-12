import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Caching mechanism to reduce API calls
const stockCache = {
  stocks: null,
  stockPrices: {},
  lastFetched: {}
};

export const stockService = {
  // Fetch all available stocks
  async getStocks() {
    // Check cache first
    if (stockCache.stocks && 
        Date.now() - stockCache.lastFetched.stocks < 5 * 60 * 1000) {
      return stockCache.stocks;
    }

    try {
      const response = await axios.get(`${BASE_URL}/stocks`);
      stockCache.stocks = response.data.stocks;
      stockCache.lastFetched.stocks = Date.now();
      return response.data.stocks;
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  },

  // Fetch stock prices for a specific ticker
  async getStockPrices(ticker, minutes = 50) {
    const cacheKey = `${ticker}_${minutes}`;
    
    // Check cache and validate cache age (5 minutes)
    if (stockCache.stockPrices[cacheKey] && 
        Date.now() - stockCache.lastFetched[cacheKey] < 5 * 60 * 1000) {
      return stockCache.stockPrices[cacheKey];
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`
      );
      
      stockCache.stockPrices[cacheKey] = response.data;
      stockCache.lastFetched[cacheKey] = Date.now();
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching prices for ${ticker}:`, error);
      throw error;
    }
  },

  // Calculate stock statistics
  calculateStockStatistics(prices) {
    if (!prices || prices.length === 0) return null;

    const values = prices.map(p => p.price);
    
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      average,
      standardDeviation,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  },

  // Calculate correlation between stocks
  calculateCorrelation(stockAPrices, stockBPrices) {
    // Ensure same length and time-aligned data
    const minLength = Math.min(stockAPrices.length, stockBPrices.length);
    
    const pricesA = stockAPrices.slice(0, minLength).map(p => p.price);
    const pricesB = stockBPrices.slice(0, minLength).map(p => p.price);

    const meanA = pricesA.reduce((a, b) => a + b, 0) / pricesA.length;
    const meanB = pricesB.reduce((a, b) => a + b, 0) / pricesB.length;

    const covarianceNumerator = pricesA.reduce((acc, price, i) => 
      acc + (price - meanA) * (pricesB[i] - meanB), 0);
    
    const covarianceValue = covarianceNumerator / (pricesA.length - 1);

    const stdDevA = Math.sqrt(
      pricesA.reduce((acc, price) => acc + Math.pow(price - meanA, 2), 0) / 
      (pricesA.length - 1)
    );
    
    const stdDevB = Math.sqrt(
      pricesB.reduce((acc, price) => acc + Math.pow(price - meanB, 2), 0) / 
      (pricesB.length - 1)
    );

    return covarianceValue / (stdDevA * stdDevB);
  }
};

export default stockService;