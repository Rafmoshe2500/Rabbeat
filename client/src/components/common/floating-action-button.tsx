// FloatingActionButton.tsx
import React from 'react';
import Fab from "@mui/material/Fab";
import AddIcon from '@mui/icons-material/Add';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  onClick, 
  icon = <AddIcon />,
  ariaLabel = "add"
}) => (
  <Fab
    color="primary"
    aria-label={ariaLabel}
    style={{ position: 'fixed', bottom: 16, right: 16 }}
    onClick={onClick}
  >
    {icon}
  </Fab>
);

export default FloatingActionButton;