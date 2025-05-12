import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  CssBaseline, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Material blue
    },
    background: {
      default: '#f4f4f4'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});

function App() {
  const [currentPage, setCurrentPage] = useState('stocks');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Stock Market Analytics
            </Typography>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              onClick={() => setCurrentPage('stocks')}
              sx={{ 
                fontWeight: currentPage === 'stocks' ? 'bold' : 'normal',
                borderBottom: currentPage === 'stocks' ? '2px solid white' : 'none'
              }}
            >
              Stock Prices
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/correlations"
              onClick={() => setCurrentPage('correlations')}
              sx={{ 
                fontWeight: currentPage === 'correlations' ? 'bold' : 'normal',
                borderBottom: currentPage === 'correlations' ? '2px solid white' : 'none'
              }}
            >
              Correlations
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlations" element={<CorrelationPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;