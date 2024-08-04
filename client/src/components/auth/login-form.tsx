// login-form.tsx
import React, { useState } from 'react';
import { Typography, Box, TextFieldProps } from '@mui/material';

interface LoginFormProps {
  onSubmit: (credentials: UserCredentials) => void;
  InputField: React.ComponentType<TextFieldProps>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, InputField }) => {
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
      <InputField
        fullWidth
        margin="normal"
        type="email"
        name="email"
        label='דוא"ל'
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <InputField
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