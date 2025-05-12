// src/api.js
import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

export const fetchStocks = async () => {
  const response = await axios.get(`${BASE_URL}/stocks`);
  return response.data.stocks;
};

export const fetchStockPrices = async (ticker, minutes = 30) => {
  const response = await axios.get(`${BASE_URL}/stocks/${ticker}?minutes=${minutes}`);
  return response.data;
};
