import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import ComputerScreenVideo from '../components/computer-screen/computer-screen';

const Default: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ direction: 'rtl'}}>
      <Typography variant="h1" align="center">
        ברוכים הבאים אל RabBeat
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ComputerScreenVideo />
      </Box>
    </Container>
  );
};

export default Default;
