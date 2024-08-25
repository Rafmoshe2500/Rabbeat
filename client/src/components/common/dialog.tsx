import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

type DialogComponentProps = {
  open: boolean;
  title: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  title,
  onClose,
  onConfirm,
  children,
  maxWidth = 'sm',
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          minWidth: { xs: '90%', sm: '300px' },
          maxWidth: { xs: '95%', sm: '600px' },
          margin: '20px',
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: '8px',
          direction: 'rtl',
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle
        sx={{
          marginBottom: '10px',
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          fontWeight: 'bold',
          padding: '16px 24px',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: '16px 24px' }}>{children}</DialogContent>
      <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
        {onClose && (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ minWidth: '80px' }}
          >
            סגור
          </Button>
        )}
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color="primary"
            variant="contained"
            sx={{ minWidth: '80px' }}
          >
            שלח
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
