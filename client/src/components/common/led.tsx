import React from 'react';
import { styled } from '@mui/system';

type LEDStatus = 'off' | 'ok' | 'half';

interface LEDProps {
  status: LEDStatus;
}

const getStatusColor = (status: LEDStatus) => {
  switch (status) {
    case 'off':
      return '#808080';
    case 'ok':
      return '#90EE90';
    case 'half':
      return '#FFA500';
  }
};

const LEDWrapper = styled('div')<LEDProps>(({ status }) => {
  const color = getStatusColor(status);
  return {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    boxShadow: status === 'off'
      ? 'inset 0 0 2px #ffffff, 0 0 2px #808080'
      : `inset 0 0 5px #ffffff, 0 0 10px ${color}`,
    border: `1px solid ${status === 'off' ? '#606060' : color}`,
    animation: status === 'off' ? 'none' : 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': {
        boxShadow: `inset 0 0 5px #ffffff, 0 0 10px ${color}`,
      },
      '50%': {
        boxShadow: `inset 0 0 10px #ffffff, 0 0 20px ${color}`,
      },
      '100%': {
        boxShadow: `inset 0 0 5px #ffffff, 0 0 10px ${color}`,
      },
    },
  };
});

const LED: React.FC<LEDProps> = ({ status }) => {
  return <LEDWrapper status={status} />;
};

export default LED;