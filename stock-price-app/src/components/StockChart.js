// src/components/StockChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchStockPrices } from '../api';
import { Box, Typography, TextField } from '@mui/material';

const StockChart = ({ ticker }) => {
  const [data, setData] = useState([]);
  const [minutes, setMinutes] = useState(30);

  useEffect(() => {
    const getData = async () => {
      const prices = await fetchStockPrices(ticker, minutes);
      setData(prices);
    };
    getData();
  }, [ticker, minutes]);

  const chartData = {
    labels: data.map((d) => new Date(d.lastUpdatedAt).toLocaleTimeString()),
    datasets: [
      {
        label: `${ticker} Price`,
        data: data.map((d) => d.price),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Average',
        data: Array(data.length).fill(
          data.reduce((sum, d) => sum + d.price, 0) / data.length
        ),
        borderColor: 'red',
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6">{ticker} Stock Prices</Typography>
      <TextField
        label="Minutes"
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <Line data={chartData} />
    </Box>
  );
};

export default StockChart;
