import React, { useState } from 'react';
import DialogComponent from '../common/dialog';
import { useSearchStudentByEmail, useAccosiateStudentToTeacher } from '../../hooks/useStudents';
import { useUser } from '../../contexts/user-context';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import RTLTextField from '../common/rtl-text-field';
import RTLDatePicker from '../common/rtl-date-picker'

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [expiredDate, setExpiredDate] = useState<Dayjs | null>(null);
  const { mutate: accosiateStudentToTeacher } = useAccosiateStudentToTeacher();
  const { data: student } = useSearchStudentByEmail(email);
  const { userDetails } = useUser();

  const handleConfirm = () => {
    if (student && expiredDate) {
      const formattedDate = expiredDate.toISOString();
      accosiateStudentToTeacher({
        studentId: student.id,
        teacherId: userDetails!.id,
        expired_date: formattedDate,
      });
      onClose();
    }
  };

  return (
    <DialogComponent
      open={open}
      title="הוספת תלמיד חדש"
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <RTLTextField
        autoFocus
        margin="dense"
        label="אימייל התלמיד"
        type="email"
        fullWidth
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {student && (
        <p>נמצא תלמיד: {student.name}</p>
      )}
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