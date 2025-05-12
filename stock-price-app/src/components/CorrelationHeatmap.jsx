import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  FormControl, 
  Select, 
  MenuItem 
} from '@mui/material';
import { fetchStocks, calculateAllCorrelations } from '../services/stockService';

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState({});
  const [correlations, setCorrelations] = useState({});
  const [timeFrame, setTimeFrame] = useState(50);
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch stocks on component mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const fetchedStocks = await fetchStocks();
        setStocks(fetchedStocks);
      } catch (error) {
        console.error('Error loading stocks:', error);
      }
    };
    loadStocks();
  }, []);

  // Calculate correlations when time frame changes
  useEffect(() => {
    const calculateCorrelations = async () => {
      try {
        const tickers = Object.values(stocks);
        const correlationMatrix = await calculateAllCorrelations(tickers, timeFrame);
        setCorrelations(correlationMatrix);
      } catch (error) {
        console.error('Error calculating correlations:', error);
      }
    };

    if (Object.keys(stocks).length > 0) {
      calculateCorrelations();
    }
  }, [stocks, timeFrame]);

  // Color mapping for correlation
  const getCorrelationColor = (correlation) => {
    if (correlation === 1) return 'rgb(0, 255, 0)'; // Perfect positive (green)
    if (correlation > 0.5) return 'rgb(100, 255, 100)'; // Strong positive (light green)
    if (correlation > 0) return 'rgb(200, 255, 200)'; // Weak positive (very light green)
    if (correlation === 0) return 'rgb(255, 255, 255)'; // No correlation (white)
    if (correlation > -0.5) return 'rgb(255, 200, 200)'; // Weak negative (light red)
    if (correlation > -1) return 'rgb(255, 100, 100)'; // Strong negative (red)
    return 'rgb(255, 0, 0)'; // Perfect negative (dark red)
  };

  // Time frame options
  const timeFrameOptions = [10, 30, 50, 100];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Stock Correlation Heatmap</Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <Select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            label="Time Frame"
          >
            {timeFrameOptions.map((option) => (
              <MenuItem key={option} value={option}>
                Last {option} minutes
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
          <Box sx={{ height: 50, width: 150 }}></Box>
          {Object.values(stocks).map((ticker) => (
            <Box 
              key={ticker} 
              sx={{ 
                height: 50, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                pr: 1,
                cursor: 'pointer',
                bgcolor: selectedStock === ticker ? 'rgba(0,0,0,0.1)' : 'transparent'
              }}
              onClick={() => setSelectedStock(ticker)}
            >
              {ticker}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex' }}>
            {Object.values(stocks).map((ticker) => (
              <Box 
                key={ticker} 
                sx={{ 
                  width: 50, 
                  height: 50, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedStock(ticker)}
              >
                {ticker}
              </Box>
            ))}
          </Box>

          {Object.values(stocks).map((rowTicker) => (
            <Box key={rowTicker} sx={{ display: 'flex' }}>
              {Object.values(stocks).map((colTicker) => {
                const correlation = correlations[rowTicker]?.[colTicker] ?? 0;
                return (
                  <Box
                    key={`${rowTicker}-${colTicker}`}
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: getCorrelationColor(correlation),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(0,0,0,0.1)',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedStock(rowTicker);
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: Math.abs(correlation) > 0.5 ? 'white' : 'black',
                        fontWeight: 'bold'
                      }}
                    >
                      {correlation.toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Correlation Legend */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 2 }}>Correlation Strength:</Typography>
        <Box sx={{ display: 'flex' }}>
          {[
            { color: 'rgb(255, 0, 0)', label: 'Strong Negative' },
            { color: 'rgb(255, 100, 100)', label: 'Weak Negative' },
            { color: 'rgb(255, 255, 255)', label: 'No Correlation' },
            { color: 'rgb(100, 255, 100)', label: 'Weak Positive' },
            { color: 'rgb(0, 255, 0)', label: 'Strong Positive' }
          ].map((item) => (
            <Box 
              key={item.label} 
              sx={{ 
                width: 50, 
                height: 20, 
                bgcolor: item.color, 
                mr: 1, 
                border: '1px solid black' 
              }}
              title={item.label}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CorrelationHeatmap;