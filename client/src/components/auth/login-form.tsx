import React, { useState } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import { useLogin } from '../../hooks/useAuth.tsx';

interface LoginFormProps {
  onSuccess: (user: LoginUser) => void;
  onError: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [credentials, setCredentials] = useState<UserCredentials>({ email: '', password: '' });
  const { loginUser, loading, error } = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(credentials);
      if (user) {
        onSuccess(user);
      } else {
        onError('ההתחברות נכשלה. אנא בדוק את פרטי הכניסה שלך.');
      }
    } catch (error) {
      onError('אירעה שגיאה בעת ניסיון ההתחברות. אנא נסה שוב מאוחר יותר.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, margin: 'auto', direction: 'rtl' }} id="login-form">
      <Typography variant="h4" gutterBottom sx={{direction: 'rtl', textAlign: 'center'}}>
        התחברות
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        type="email"
        name="email"
        label='דוא"ל'
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <TextField
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