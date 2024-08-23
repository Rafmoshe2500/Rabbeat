import React from 'react';
import { Box, styled } from '@mui/material';

const LoaderContainer = styled(Box)(({ }) => ({
  position: 'relative',
  perspective: '1000px',
  transformStyle: 'preserve-3d',
}));

const Page = styled(Box)(({ }) => ({
  position: 'absolute',
  top: '3%',
  left: '3%',
  backgroundColor: '#f0f0f0',
  transformOrigin: 'right center',
  animation: 'flipPage 1.5s infinite ease-in-out',
  overflow: 'hidden',
  '@keyframes flipPage': {
    '0%': {
      transform: 'rotateY(0deg)',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    },
    '20%': {
      backgroundColor: '#e0e0e0',
    },
    '40%, 100%': {
      transform: 'rotateY(180deg)',
      backgroundColor: '#d0d0d0',
      boxShadow: '5px 0 5px rgba(0, 0, 0, 0.1)',
    },
  },
}));

const Cover = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  top: 0,
  transformOrigin: 'right center',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
}));

const TextContent = styled(Box)(({ }) => ({
  position: 'absolute',
  top: '10%',
  left: '10%',
  width: '80%',
  height: '80%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
}));

const TextLine = styled(Box)(({ }) => ({
  height: '8px',
  backgroundColor: '#333',
  marginBottom: '8px',
}));

interface BookLoaderProps {
  size?: number;
}

const BookLoader: React.FC<BookLoaderProps> = ({ size = 80 }) => {
  const coverWidth = size * 1.05;
  const coverHeight = size * 1.3;
  const pageWidth = size;
  const pageHeight = size * 1.25;

  return (
    <LoaderContainer sx={{ width: coverWidth * 2, height: coverHeight, margin: `${size / 2}px auto` }}>
    <Cover sx={{ 
        right: 0, 
        width: coverWidth, 
        height: coverHeight, 
        borderRadius: '0 3px 3px 0',
        zIndex: 1,
      }} />
      <Cover sx={{ 
        left: 0, 
        width: coverWidth, 
        height: coverHeight, 
        borderRadius: '3px 0 0 3px',
        zIndex: 1,
      }} />
      {[0, 1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((index) => (
        <Page
          key={index}
          sx={{
            width: pageWidth,
            height: pageHeight,
            animationDelay: `${index * 0.25}s`,
            borderRadius: '2px 0 0 2px',
            right: coverWidth * 0.05,
            zIndex: 3 - index,
          }}
        >
          <TextContent>
            {[...Array(5)].map((_, i) => (
              <TextLine key={i} sx={{ width: `${Math.random() * 30 + 60}%` }} />
            ))}
          </TextContent>
        </Page>
      ))}
    </LoaderContainer>
  );
};

export default BookLoader;