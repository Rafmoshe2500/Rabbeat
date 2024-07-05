import React, { useState } from 'react';
import { Typography, Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Grid } from '@mui/material';
import { useRegister } from '../../hooks/useAuth.tsx';
import RTLTextField from '../../utils/rtl-text-field'

interface RegisterFormProps {
  onSuccess: (token: string) => void;
  onError: (message: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
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
  const { registerUser, loading, error } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.password !== userData.confirm_password) {
      onError('הסיסמאות אינן תואמות. אנא נסה שוב.');
      return;
    }
    try {
      const token = await registerUser(userData);
      if (token) {
        onSuccess(token);
      } else {
        onError('ההרשמה נכשלה. אנא בדוק את הפרטים שהזנת ונסה שוב.');
      }
    } catch (error) {
      onError('אירעה שגיאה בעת ניסיון ההרשמה. אנא נסה שוב מאוחר יותר.');
    }
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