import React from 'react';
import { Box, Typography } from '@mui/material';
import localVideo from '../../assets/videos/RabBeat.mp4';

const ComputerScreenVideo: React.FC = () => {
  return (
    <Box
      sx={{
        width: '90%', // Responsive width
        maxWidth: '960px', // Increased the maximum width for a larger screen
        height: 'auto',
      }}
    >
      <Typography variant="h4">5 דקות על המערכת</Typography>
      <Box
        sx={{
          width: '100%', // Responsive width
          maxWidth: '960px', // Increased the maximum width for a larger screen
          height: 'auto',
          paddingTop: '56.25%', // Maintain the 16:9 aspect ratio
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: '32px', // Increased the border radius for the larger size
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(0,0,0,0.4)', // Increased the shadow for the larger size
          margin: '0 auto', // Center the container
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '4%', // Maintain spacing for the larger size
            left: '4%',
            right: '4%',
            bottom: '10%', // Adjusted for the "stand" effect
            backgroundColor: '#333',
            borderRadius: '16px', // Increased the inner border radius
            overflow: 'hidden',
          }}
        >
          <video
            width="100%"
            height="100%"
            controls
            style={{ objectFit: 'cover' }}
          >
            <source src={localVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '4%', // Maintain the "stand" effect
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50%', // Adjusted width to be proportional to the larger size
            height: '10%', // Adjusted height to be proportional to the larger size
            backgroundColor: '#666',
            borderRadius: '8px', // Increased the radius for the stand
          }}
        />
      </Box>
    </Box>
  );
};

export default ComputerScreenVideo;
