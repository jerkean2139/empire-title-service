import React from 'react';
import { Container, Typography, Button, Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          401
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography color="text.secondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
