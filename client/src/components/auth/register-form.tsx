import React, { useState } from 'react';
import {
  Typography,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  TextFieldProps,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface RegisterFormProps {
  onSubmit: (userData: UserRegister) => void;
  InputField: React.ComponentType<TextFieldProps>;
}

interface FieldValidation {
  isValid: boolean;
  message: string;
}

interface UserRegister {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDay: string;
  type: 'student' | 'teacher';
  password: string;
  confirm_password: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  InputField,
}) => {
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

  const [validations, setValidations] = useState<
    Record<keyof UserRegister, FieldValidation>
  >({
    id: { isValid: true, message: '' },
    firstName: { isValid: true, message: '' },
    lastName: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    phoneNumber: { isValid: true, message: '' },
    address: { isValid: true, message: '' },
    birthDay: { isValid: true, message: '' },
    type: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirm_password: { isValid: true, message: '' },
  });


  const validateField = (
    name: keyof UserRegister,
    value: string
  ): FieldValidation => {
    switch (name) {
      case 'id':
        return validateIsraeliID(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirm_password':
        return validateConfirmPassword(value, userData.password);
      case 'phoneNumber':
        return validatePhoneNumber(value);
      default:
        return {
          isValid: value.trim() !== '',
          message: value.trim() !== '' ? 'הכל תקין' : 'שדה זה הוא חובה',
        };
    }
  };

  const validateIsraeliID = (id: string): FieldValidation => {
    if (id.trim() === '') return { isValid: false, message: 'שדה זה הוא חובה' };
    if (!/^\d{9}$/.test(id)) {
      return { isValid: false, message: 'מספר זהות חייב להכיל 9 ספרות' };
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id.charAt(i), 10);
      if (i % 2 === 0) {
        digit *= 1;
      } else {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }

    return {
      isValid: sum % 10 === 0,
      message: sum % 10 === 0 ? 'הכל תקין' : 'מספר זהות לא תקין',
    };
  };

  const validateEmail = (email: string): FieldValidation => {
    if (email.trim() === '')
      return { isValid: false, message: 'שדה זה הוא חובה' };
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return {
      isValid: re.test(email),
      message: re.test(email) ? 'הכל תקין' : 'כתובת אימייל לא תקינה',
    };
  };

  const validatePassword = (password: string): FieldValidation => {
    if (password.trim() === '')
      return { isValid: false, message: 'שדה זה הוא חובה' };
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return {
      isValid: re.test(password),
      message: re.test(password)
        ? 'הכל תקין'
        : 'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר',
    };
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ): FieldValidation => {
    if (confirmPassword.trim() === '')
      return { isValid: false, message: 'שדה זה הוא חובה' };
    return {
      isValid: confirmPassword === password,
      message:
        confirmPassword === password ? 'הכל תקין' : 'הסיסמאות אינן תואמות',
    };
  };

  const validatePhoneNumber = (phoneNumber: string): FieldValidation => {
    if (phoneNumber.trim() === '')
      return { isValid: false, message: 'שדה זה הוא חובה' };
    const re = /^05\d{8}$/;
    return {
      isValid: re.test(phoneNumber),
      message: re.test(phoneNumber) ? 'הכל תקין' : 'מספר טלפון לא תקין',
    };
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    const validation = validateField(name as keyof UserRegister, value);
    setValidations({ ...validations, [name]: validation });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allValidations = Object.entries(userData).reduce(
      (acc, [key, value]) => {
        acc[key as keyof UserRegister] = validateField(
          key as keyof UserRegister,
          value
        );
        return acc;
      },
      {} as Record<keyof UserRegister, FieldValidation>
    );

    setValidations(allValidations);

    if (Object.values(allValidations).every((v) => v.isValid)) {
      onSubmit(userData);
    }
  };

  const inputStyle = {
    width: '90%',
    margin: '8px auto',
  };

  const renderValidationIcon = (field: keyof UserRegister) => {
    if (userData[field] === '') return null;
    return (
      <Tooltip title={validations[field].message}>
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            left: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {validations[field].isValid ? (
            <CheckCircleOutlineIcon color="success" />
          ) : (
            <ErrorOutlineIcon color="error" />
          )}
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '600px', md: '800px' },
        margin: '0 auto',
        direction: 'rtl',
      }}
      id="register-form"
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ direction: 'rtl', textAlign: 'center' }}
      >
        הרשמה
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <InputField
            sx={inputStyle}
            name="id"
            label='ת"ז'
            value={userData.id}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('id'),
            }}
          />
          <InputField
            sx={inputStyle}
            name="firstName"
            label="שם פרטי"
            value={userData.firstName}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('firstName'),
            }}
          />
          <InputField
            sx={inputStyle}
            name="lastName"
            label="שם משפחה"
            value={userData.lastName}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('lastName'),
            }}
          />
          <InputField
            sx={inputStyle}
            type="email"
            name="email"
            label='דוא"ל'
            value={userData.email}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('email'),
            }}
          />
          <InputField
            sx={inputStyle}
            name="phoneNumber"
            label="פלאפון"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('phoneNumber'),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputField
            sx={inputStyle}
            name="address"
            label="כתובת מגורים"
            value={userData.address}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('address'),
            }}
          />
          <InputField
            sx={inputStyle}
            type="date"
            name="birthDay"
            label="תאריך לידה"
            value={userData.birthDay}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            InputProps={{
              endAdornment: renderValidationIcon('birthDay'),
            }}
          />
          <FormControl sx={{ ...inputStyle, display: 'flex' }}>
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
              <MenuItem value="student" dir="rtl">
                תלמיד
              </MenuItem>
              <MenuItem value="teacher" dir="rtl">
                מורה
              </MenuItem>
            </Select>
          </FormControl>
          <InputField
            sx={inputStyle}
            type="password"
            name="password"
            label="סיסמא"
            value={userData.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('password'),
            }}
          />
          <InputField
            sx={inputStyle}
            type="password"
            name="confirm_password"
            label="אימות סיסמא"
            value={userData.confirm_password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: renderValidationIcon('confirm_password'),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;
