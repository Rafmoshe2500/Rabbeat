import React, { useState } from 'react';
import DialogComponent from '../common/dialog';
import {
  useSearchStudents,
  useAssociateStudentToTeacher,
} from '../../hooks/useStudents';
import { useUser } from '../../contexts/user-context';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RTLDatePicker from '../common/rtl-inputs/rtl-date-picker';
import { TextField, Autocomplete } from '@mui/material';

interface AddStudentDialogProps {
  open: boolean;
  onClose: (studentAdded: boolean) => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  open,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<SearchStudent | null>(
    null
  );
  const [expiredDate, setExpiredDate] = useState<Dayjs | null>(null);
  const { mutate: associateStudentToTeacher } = useAssociateStudentToTeacher();
  const { data: students, isLoading } = useSearchStudents(query);
  const { userDetails } = useUser();

  const handleConfirm = () => {
    if (selectedStudent && expiredDate) {
      const formattedDate = expiredDate.toISOString();
      associateStudentToTeacher({
        studentId: selectedStudent.id,
        teacherId: userDetails!.id,
        expired_date: formattedDate,
      });
      onClose(true);
    }
  };

  return (
    <DialogComponent
      open={open}
      title="הוספת תלמיד חדש"
      onClose={() => onClose(false)}
      onConfirm={handleConfirm}
    >
      <Autocomplete<SearchStudent>
        options={students || []}
        getOptionLabel={(option) => `${option.name} (${option.email})`}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{marginBottom: '5px'}}
            label="חיפוש תלמיד"
            variant="outlined"
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        loading={isLoading}
        onChange={(_, newValue) => setSelectedStudent(newValue)}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RTLDatePicker
          label="תאריך תפוגה"
          value={expiredDate}
          onChange={(newValue: Dayjs | null) => setExpiredDate(newValue)}
        />
      </LocalizationProvider>
    </DialogComponent>
  );
};

export default AddStudentDialog;
