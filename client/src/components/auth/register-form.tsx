import React, { useState } from 'react';
import { Typography, Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Grid } from '@mui/material';
import RTLTextField from '../common/rtl-text-field'

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
          <RTLTextField fullWidth margin="normal" name="id" label='ת"ז' value={userData.id} onChange={handleChange} required />
          <RTLTextField fullWidth margin="normal" name="firstName" label="שם פרטי" value={userData.firstName} onChange={handleChange} required />
          <RTLTextField fullWidth margin="normal" name="lastName" label="שם משפחה" value={userData.lastName} onChange={handleChange} required />
          <RTLTextField fullWidth margin="normal" type="email" name="email" label='דוא"ל' value={userData.email} onChange={handleChange} required />
          <RTLTextField fullWidth margin="normal" name="phoneNumber" label="פלאפון" value={userData.phoneNumber} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RTLTextField fullWidth margin="normal" name="address" label="כתובת מגורים" value={userData.address} onChange={handleChange} required />
          <RTLTextField
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
            <InputLabel id="type-label" >סוג משתמש</InputLabel>
            <Select labelId="type-label" name="type" value={userData.type} onChange={handleChange} sx={{direction: 'rtl'}} required>
              <MenuItem value="student">תלמיד</MenuItem>
              <MenuItem value="teacher">מורה</MenuItem>
            </Select>
          </FormControl>
          <RTLTextField fullWidth margin="normal" type="password" name="password" label="סיסמא" value={userData.password} onChange={handleChange} required />
          <RTLTextField
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