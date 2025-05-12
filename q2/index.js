const express = require('express');
const axios = require('axios');
const config = require('./config.json');

const app = express();
const WINDOW = config.windowSize || 10;
const TIMEOUT = 500; // ms

// In‐memory sliding windows for each id
const windows = {
  p: [], // primes
  f: [], // fibo
  e: [], // even
  r: []  // random
};

// map qualified IDs to test‐server endpoints
const endpointMap = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;
  if (!endpointMap[id]) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prevState = [...windows[id]];
  let fetched = [];
  try {
    const resp = await axios.get(
      `http://20.244.56.144/evaluation-service/${endpointMap[id]}`,
      { timeout: TIMEOUT }
    );
    fetched = Array.isArray(resp.data.numbers)
      ? resp.data.numbers
      : [];
  } catch (e) {
    // on timeout or error, leave fetched as []
    fetched = [];
  }

  // append only new unique numbers
  for (const n of fetched) {
    if (!windows[id].includes(n)) {
      windows[id].push(n);
      if (windows[id].length > WINDOW) {
        windows[id].shift(); // drop oldest
      }
    }
  }

  const currState = [...windows[id]];
  // calculate average if at least 1 number; round to 2 decimals
  const avg =
    currState.length > 0
      ? Number(
          (
            currState.reduce((a, b) => a + b, 0) /
            currState.length
          ).toFixed(2)
        )
      : 0;

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: fetched,
    avg
  });
});

app.listen(config.port, () => {
  console.log(
    `Average Calculator service listening on port ${config.port}`
  );
});
