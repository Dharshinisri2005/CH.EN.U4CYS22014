import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  Typography, 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Paper 
} from '@mui/material';

const StockChart = ({ stockData, ticker }) => {
  const [timeFrame, setTimeFrame] = useState(50);

  // Calculate average price
  const averagePrice = useMemo(() => {
    if (!stockData || stockData.length === 0) return 0;
    return stockData.reduce((sum, item) => sum + item.price, 0) / stockData.length;
  }, [stockData]);

  // Prepare chart data with timestamps
  const chartData = useMemo(() => {
    return stockData.map((item, index) => ({
      ...item,
      timestamp: new Date(item.lastUpdatedAt).toLocaleTimeString(),
      index: index + 1
    }));
  }, [stockData]);

  // Time frame options
  const timeFrameOptions = [10, 30, 50, 100];

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{ticker} Stock Price</Typography>
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

      {chartData.length > 0 ? (
        <LineChart width={800} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="body2">
                      Time: {data.timestamp}
                    </Typography>
                    <Typography variant="body2">
                      Price: ${data.price.toFixed(2)}
                    </Typography>
                  </Paper>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            name="Stock Price" 
          />
          <ReferenceLine 
            y={averagePrice} 
            label={`Avg: $${averagePrice.toFixed(2)}`} 
            stroke="red" 
            strokeDasharray="3 3" 
          />
        </LineChart>
      ) : (
        <Typography variant="body1">No stock data available</Typography>
      )}
    </Paper>
  );
};

export default StockChart;