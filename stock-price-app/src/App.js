// src/App.js
import React, { useEffect, useState } from 'react';
import { fetchStocks } from './api';
import StockChart from './components/StockChart';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import { Container, Typography, Select, MenuItem } from '@mui/material';

function App() {
  const [stocks, setStocks] = useState({});
  const [selectedTicker, setSelectedTicker] = useState('');

  useEffect(() => {
    const getStocks = async () => {
      const stockList = await fetchStocks();
      setStocks(stockList);
      setSelectedTicker(Object.values(stockList)[0]);
    };
    getStocks();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Stock Analytics Dashboard
      </Typography>
      <Select
        value={selectedTicker}
        onChange={(e) => setSelectedTicker(e.target.value)}
        style={{ marginBottom: '1rem' }}
      >
        {Object.entries(stocks).map(([name, ticker]) => (
          <MenuItem key={ticker} value={ticker}>
            {name}
          </MenuItem>
        ))}
      </Select>
      {selectedTicker && <StockChart ticker={selectedTicker} />}
      <CorrelationHeatmap />
    </Container>
  );
}

export default App;
