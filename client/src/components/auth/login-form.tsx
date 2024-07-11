// login-form.tsx
import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import RTLTextField from '../common/rtl-text-field';

interface LoginFormProps {
  onSubmit: (credentials: UserCredentials) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [credentials, setCredentials] = useState<UserCredentials>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, margin: 'auto', direction: 'rtl' }} id="login-form">
      <Typography variant="h4" gutterBottom sx={{direction: 'rtl', textAlign: 'center'}}>
        התחברות
      </Typography>
      <RTLTextField
        fullWidth
        margin="normal"
        type="email"
        name="email"
        label='דוא"ל'
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <RTLTextField
        fullWidth
        margin="normal"
        type="password"
        name="password"
        label="סיסמא"
        value={credentials.password}
        onChange={handleChange}
        required
      />
    </Box>
  );
};

export default LoginForm;