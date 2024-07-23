import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // SaddleBrown
      light: '#A0522D', // Sienna
      dark: '#5E2F0D', // Darker brown
    },
    secondary: {
      main: '#9E9E9E',  // Medium Light Gray
      light: '#EEEEEE', // Very Light Gray
      dark: '#616161',  // Dark Gray
    },
    background: {
      default: '#F5F5F5', // WhiteSmoke
      paper: '#FFFFFF', // White
    },
    text: {
      primary: '#4B4949', // Dark gray, almost black
      secondary: '#666666', // Medium gray
    },
    divider: '#D3D3D3', // LightGray
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;