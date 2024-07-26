import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import RTLTextField from './rtl-text-field';

interface RTLDatePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

const RTLDatePicker: React.FC<RTLDatePickerProps> = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slots={{
          textField: RTLTextField,
        }}
        slotProps={{
          textField: {
            variant: 'outlined',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default RTLDatePicker;