import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from '../components/auth/login-form';
import RegisterForm from '../components/auth/register-form';
import { useUser } from '../contexts/user-context'; // Import UserContext

const RotatingPaper = styled(Paper)<{ isflipped: boolean }>(({ isflipped }) => ({
  width: 800,
  height: 600,
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  transform: isflipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
}));

const FormSide = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '24px',
  overflowY: 'auto',
});

const FrontSide = styled(FormSide)({
  zIndex: 2,
  transform: 'rotateY(0deg)',
});

const BackSide = styled(FormSide)({
  transform: 'rotateY(180deg)',
});

const ButtonContainer = styled('div')({
  position: 'absolute',
  bottom: '60px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  zIndex: 3,
});

const MessageOverlay = styled('div')<{ isError?: boolean }>(({ isError }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: isError ? 'rgba(244, 67, 54, 0.9)' : 'rgba(76, 175, 80, 0.9)',
  color: 'white',
  padding: '16px 24px',
  borderRadius: '8px',
  fontSize: '18px',
  zIndex: 4,
  textAlign: 'center',
}));

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const navigate = useNavigate();
  const { setUserDetails } = useUser(); 

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSuccess = (user: User) => {
    setMessage({ text: isLogin ? 'התחברת בהצלחה!' : 'נרשמת בהצלחה!', isError: false });
    setUserDetails(user); 
    setTimeout(() => {
      setMessage(null);
      navigate('/home', { state: { user } });
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    setMessage({ text: errorMessage, isError: true });
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <RotatingPaper isflipped={!isLogin} elevation={3} sx={{alignItems: 'center', justifyContent: 'center'}}>
      <FrontSide>
        {message && <MessageOverlay sx={{direction: 'rtl'}} isError={message.isError}>{message.text}</MessageOverlay>}
        <LoginForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <ButtonContainer>
          <Button variant="contained" color="primary" type="submit" form="login-form">
            התחבר
          </Button>
          <Button onClick={toggleForm}>
            להרשמה
          </Button>
        </ButtonContainer>
      </FrontSide>
      <BackSide>
        {message && <MessageOverlay sx={{direction: 'rtl'}} isError={message.isError}>{message.text}</MessageOverlay>}
        <RegisterForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        <ButtonContainer>
          <Button variant="contained" color="primary" type="submit" form="register-form">
            הרשם
          </Button>
          <Button onClick={toggleForm}>
            להתחברות
          </Button>
        </ButtonContainer>
      </BackSide>
    </RotatingPaper>
  );
};

export default AuthForm;
