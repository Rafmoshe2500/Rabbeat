import React, { useState } from 'react';
import { Typography, Box, Select, MenuItem, SelectChangeEvent, Grid, TextField, FormControl, InputLabel } from '@mui/material';

interface RegisterFormProps {
  onSubmit: (userData: UserRegister) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [userData, setUserData] = useState<UserRegister>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    birthDay: '',
    type: 'student',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.password !== userData.confirm_password) {
      // You might want to handle this error in the parent component
      alert('הסיסמאות אינן תואמות. אנא נסה שוב.');
      return;
    }
    onSubmit(userData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' , direction: 'rtl'}} id="register-form">
      <Typography variant="h4" gutterBottom sx={{direction: 'rtl', textAlign: 'center'}}>
        הרשמה
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth margin="normal" name="id" label='ת"ז' value={userData.id} onChange={handleChange} required />
          <TextField fullWidth margin="normal" name="firstName" label="שם פרטי" value={userData.firstName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" name="lastName" label="שם משפחה" value={userData.lastName} onChange={handleChange} required />
          <TextField fullWidth margin="normal" type="email" name="email" label='דוא"ל' value={userData.email} onChange={handleChange} required />
          <TextField fullWidth margin="normal" name="phoneNumber" label="פלאפון" value={userData.phoneNumber} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth margin="normal" name="address" label="כתובת מגורים" value={userData.address} onChange={handleChange} required />
          <TextField
            fullWidth
            margin="normal"
            type="date"
            name="birthDay"
            label="תאריך לידה"
            value={userData.birthDay}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
<FormControl fullWidth margin="normal">
  <InputLabel id="type-label">סוג משתמש</InputLabel>
  <Select
    labelId="type-label"
    id="type"
    name="type"
    value={userData.type}
    onChange={handleChange}
    label="סוג משתמש"
    sx={{
      direction: 'rtl',
      textAlign: 'right',
      '& .MuiSelect-select': {
        paddingRight: '32px',
        paddingLeft: '14px',
      },
      '& .MuiSelect-icon': {
        right: 'auto',
        left: '7px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        textAlign: 'right',
      },
    }}
    required
  >
    <MenuItem value="student" dir='rtl'>תלמיד</MenuItem>
    <MenuItem value="teacher" dir='rtl'>מרצה</MenuItem>
  </Select>
</FormControl>
          <TextField fullWidth margin="normal" type="password" name="password" label="סיסמא" value={userData.password} onChange={handleChange} required />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="confirm_password"
            label="אימות סיסמא"
            value={userData.confirm_password}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;