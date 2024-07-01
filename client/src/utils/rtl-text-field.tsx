import { TextField, styled } from '@mui/material';

const RTLTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    right: 20, // Moved slightly to the left
    left: 'auto',
    transformOrigin: 'right',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(3px, -9px) scale(0.75)', // Adjusted to move higher and more to the left
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      textAlign: 'right',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-outlined': {
    transform: 'translate(-14px, 14px) scale(1)', // Adjusted initial position
  },
}));

export default RTLTextField;