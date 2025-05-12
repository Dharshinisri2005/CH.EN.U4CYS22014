// src/components/CorrelationHeatmap.js
import React, { useEffect, useState } from 'react';
import { fetchStocks, fetchStockPrices } from '../api';
import { Box, Typography, TextField } from '@mui/material';
import { HeatMap } from 'react-heatmap-grid';

const CorrelationHeatmap = () => {
  const [tickers, setTickers] = useState([]);
  const [dataMatrix, setDataMatrix] = useState([]);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    const getData = async () => {
      const stocks = await fetchStocks();
      const symbols = Object.values(stocks).slice(0, 5); // Limit to 5 for simplicity
      setTickers(symbols);

      const priceData = await Promise.all(
        symbols.map((ticker) => fetchStockPrices(ticker, minutes))
      );

      const prices = priceData.map((data) => data.map((d) => d.price));

      // Compute correlation matrix
      const matrix = symbols.map((_, i) =>
        symbols.map((_, j) => computeCorrelation(prices[i], prices[j]))
      );

      setDataMatrix(matrix);
    };
    getData();
  }, [minutes]);

  const computeCorrelation = (x, y) => {
    const n = x.length;
    const avgX = x.reduce((a, b) => a + b, 0) / n;
    const avgY = y.reduce((a, b) => a + b, 0) / n;
    const numerator = x.reduce((sum, xi, idx) => sum + (xi - avgX) * (y[idx] - avgY), 0);
    const denominator = Math.sqrt(
      x.reduce((sum, xi) => sum + Math.pow(xi - avgX, 2), 0) *
      y.reduce((sum, yi) => sum + Math.pow(yi - avgY, 2), 0)
    );
    return (numerator / denominator).toFixed(2);
  };

  return (
    <Box>
      <Typography variant="h6">Correlation Heatmap</Typography>
      <TextField
        label="Minutes"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <HeatMap
        xLabels={tickers}
        yLabels={tickers}
        data={dataMatrix}
        squares
        height={30}
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(255, ${255 - value * 255}, ${255 - value * 255})`,
          fontSize: "11px",
        })}
        cellRender={(value) => value}
      />
    </Box>
  );
};

export default CorrelationHeatmap;
