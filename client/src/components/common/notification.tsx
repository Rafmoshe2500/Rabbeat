import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface NotificationProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%', maxWidth: '300px' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
