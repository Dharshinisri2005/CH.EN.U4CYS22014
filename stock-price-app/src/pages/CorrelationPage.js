import React from 'react';
import { Container, Typography } from '@mui/material';
import CorrelationHeatmap from '../components/CorrelationHeatmap';

const CorrelationPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Stock Correlation Analysis
      </Typography>
      
      <CorrelationHeatmap />
    </Container>
  );
};

export default CorrelationPage;