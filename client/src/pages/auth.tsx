import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from '../components/auth/login-form';
import RegisterForm from '../components/auth/register-form';
import { useUser } from '../contexts/user-context'; // Import UserContext

interface AuthFormProps {
  initialForm?: 'login' | 'register';
}

const RotatingPaper = styled(Paper)<{ isflipped: boolean }>(({ isflipped }) => ({
  width: '100%',
  maxWidth: 800,
  minHeight: 600,
  position: 'relative',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  transform: isflipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  margin: '20px auto',
  borderRadius: '16px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
}));

const FormSide = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // padding: '24px',
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
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  marginTop: 'auto', // This will push the buttons to the bottom
  paddingTop: '24px', // Add some space above the buttons
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

const AuthForm: React.FC<AuthFormProps> = ({ initialForm }) => {
  const [isLogin, setIsLogin] = useState(initialForm === 'register' ? false : true);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserDetails } = useUser(); 

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const form = searchParams.get('form');
    if (form === 'register') {
      setIsLogin(false);
    } else if (form === 'login') {
      setIsLogin(true);
    }
  }, [location]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    navigate(`/auth?form=${isLogin ? 'register' : 'login'}`);
  };

  const handleSuccess = (user: User) => {
    setMessage({ text: isLogin ? 'התחברת בהצלחה!' : 'נרשמת בהצלחה!', isError: false });
    setTimeout(() => {
        setMessage(null)
        setUserDetails(user);
        navigate('/home'), 2000});
  };

  const handleError = (errorMessage: string) => {
    setMessage({ text: errorMessage, isError: true });
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  return (
    <div className="auth-container">
      <RotatingPaper isflipped={!isLogin} elevation={3}>
        <FrontSide>
          {message && <MessageOverlay isError={message.isError}>{message.text}</MessageOverlay>}
          <div className="form-content">
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
          </div>
        </FrontSide>
        <BackSide>
          {message && <MessageOverlay isError={message.isError}>{message.text}</MessageOverlay>}
          <div className="form-content">
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
          </div>
        </BackSide>
      </RotatingPaper>
    </div>
  );
};

export default AuthForm;
