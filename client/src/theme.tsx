import { createTheme } from "@mui/material/styles";

export const rtlInputStyles = {
  "& .MuiInputLabel-root": {
    right: 20,
    left: "auto",
    transformOrigin: "right",
    "&.MuiInputLabel-shrink": {
      transform: "translate(3px, -9px) scale(0.75)",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      textAlign: "right",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#8B4513",
    },
  },
  "& .MuiInputLabel-outlined": {
    transform: "translate(-14px, 14px) scale(1)",
  },
  // Add these lines for better RTL support
  "& .MuiInputBase-input": {
    textAlign: "right",
  },
  "& .MuiSelect-icon": {
    right: "auto",
    left: 7,
  },
};

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#E4CC9D", // SaddleBrown
      // main: '#8B4513', // SaddleBrown
      light: "#A0522D", // Sienna
      dark: "#5E2F0D", // Darker brown
    },
    secondary: {
      main: "#9E9E9E", // Medium Light Gray
      light: "#EEEEEE", // Very Light Gray
      dark: "#616161", // Dark Gray
    },
    background: {
      default: "#F5F5F5", // WhiteSmoke
      paper: "#FFFFFF", // White
    },
    text: {
      primary: "#4B4949", // Dark gray, almost black
      secondary: "#666666", // Medium gray
    },
    divider: "#D3D3D3", // LightGray
  },
  typography: {
    fontFamily: "Heebo",
    h1: {
      fontSize: "3rem",
      fontWeight: 800,
      textTransform: "uppercase",
      color: "#4B4949",
      textShadow: "2px 2px 4px rgba(94,47,13,0.3)",
      letterSpacing: "0.05em",
      position: "relative",
      display: "inline-block",
      padding: "0 10px",
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        height: "2px",
        background: "#A0522D",
        transition: "width 0.3s ease-in-out",
      },
      "&::before": {
        right: "100%",
        width: "0",
      },
      "&::after": {
        left: "100%",
        width: "0",
      },
      "&:hover::before, &:hover::after": {
        width: "50%",
      },
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#5E2F0D",
      letterSpacing: "0.03em",
      position: "relative",
      display: "inline-block",
      padding: "0 10px",
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        height: "1px",
        background: "#9E9E9E",
        transition: "width 0.3s ease-in-out",
      },
      "&::before": {
        right: "100%",
        width: "0",
      },
      "&::after": {
        left: "100%",
        width: "0",
      },
      "&:hover::before, &:hover::after": {
        width: "100%",
      },
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
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
    MuiTextField: {
      styleOverrides: {
        root: rtlInputStyles,
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: rtlInputStyles,
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: rtlInputStyles,
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingRight: 0,
          paddingLeft: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          textAlign: "right",
          paddingRight: 16,
          paddingLeft: 16,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          alignSelf: "end",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // White background for inputs
          color: "#4B4949", // Dark gray text color
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B4513", // SaddleBrown on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B4513", // SaddleBrown when focused
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#8B4513", // SaddleBrown for icon buttons
          "&:hover": {
            backgroundColor: "rgba(139, 69, 19, 0.04)", // Light SaddleBrown background on hover
          },
        },
      },
    },
  },
});

export default theme;
