// DialogComponent.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

type DialogComponentProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
};

const DialogComponent: React.FC<DialogComponentProps> = ({ open, title, onClose, onConfirm, children }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{direction: 'rtl', textAlign: 'center'}}>
      <DialogTitle >{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{justifyContent: 'center'}}>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={onConfirm} color="primary">אישור</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;