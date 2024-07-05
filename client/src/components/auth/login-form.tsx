import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { useLogin } from '../../hooks/useAuth';
import RTLTextField from '../../utils/rtl-text-field';

interface LoginFormProps {
  onSuccess: (token: string) => void;
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
      const response = await loginUser(credentials);
      if (response) {
        onSuccess(response);
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
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default LoginForm;