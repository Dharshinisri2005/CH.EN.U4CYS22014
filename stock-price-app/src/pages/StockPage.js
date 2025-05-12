import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  FormControl, 
  Select, 
  MenuItem 
} from '@mui/material';
import StockChart from '../components/StockChart';
import { fetchStocks, fetchStockPriceHistory } from '../services/stockService';

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedTicker, setSelectedTicker] = useState('');
  const [stockData, setStockData] = useState([]);

  // Fetch available stocks on component mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const fetchedStocks = await fetchStocks();
        setStocks(fetchedStocks);
        
        // Set default to first stock
        const firstTicker = Object.values(fetchedStocks)[0];
        setSelectedTicker(firstTicker);
      } catch (error) {
        console.error('Error loading stocks:', error);
      }
    };
    loadStocks();
  }, []);

  // Fetch stock price history when ticker changes
  useEffect(() => {
    const loadStockData = async () => {
      if (!selectedTicker) return;

      try {
        const priceHistory = await fetchStockPriceHistory(selectedTicker);
        setStockData(priceHistory);
      } catch (error) {
        console.error(`Error fetching data for ${selectedTicker}:`, error);
        setStockData([]);
      }
    };

    loadStockData();
    
    // Set up polling to refresh data every minute
    const intervalId = setInterval(loadStockData, 60000);
    return () => clearInterval(intervalId);
  }, [selectedTicker]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Stock Price Tracker
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>
          Select Stock:
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <Select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            label="Stock"
          >
            {Object.entries(stocks).map(([fullName, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {fullName} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <StockChart 
        stockData={stockData} 
        ticker={selectedTicker} 
      />
    </Container>
  );
};

export default StockPage;