import React, { ReactNode } from 'react';
import { FormControl, FormHelperText, InputLabel, styled } from '@mui/material';

const StyledFormControl = styled(FormControl)(() => ({
  '& .MuiFormLabel-root': {
    right: 20,
    left: 'auto',
    transformOrigin: 'right',
    '&.MuiFormLabel-filled, &.Mui-focused': {
      transform: 'translate(6px, -4px) scale(0.75)',
    },
  },
}));

interface RTLFormControlProps {
  label: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  children?: ReactNode;
}

const RTLFormControl: React.FC<RTLFormControlProps> = ({
  label,
  error,
  helperText,
  required,
  fullWidth,
  margin,
  children,
}) => {
  return (
    <StyledFormControl error={error} fullWidth={fullWidth} margin={margin} required={required}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  );
};

export default RTLFormControl;