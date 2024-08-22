import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Button, Box, TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import LoginForm from "../components/auth/login-form";
import RegisterForm from "../components/auth/register-form";
import { useUser } from "../contexts/user-context";
import { storeToken, decodeToken, isTokenValid, getToken } from "../utils/jwt-cookies";
import { useLogin, useRegister } from "../hooks/useAuth";
import withFade from "../hoc/withFade.hoc";
import CardSkeleton from "../components/skeletons/cards-skeleton";
import Toaster from "../components/common/toaster";
import useToaster from "../hooks/useToaster";

const RotatingPaper = styled(Paper)<{ isflipped: boolean }>(
  ({ theme, isflipped }) => ({
    width: "100%",
    maxWidth: 800,
    [theme.breakpoints.up('md')]: {
      maxWidth: 1000, // Increased width for desktop
    },
    minHeight: 600,
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.6s",
    transform: isflipped ? "rotateY(180deg)" : "rotateY(0deg)",
    margin: "20px auto",
    borderRadius: "16px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  })
);

const FormSide = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflowY: "auto",
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2), // Less padding on mobile
  },
}));

const FrontSide = styled(FormSide)({
  zIndex: 2,
  transform: "rotateY(0deg)",
});

const BackSide = styled(FormSide)({
  transform: "rotateY(180deg)",
});

const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  marginTop: "auto",
  paddingTop: "24px",
});

const InputField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [theme.breakpoints.down('sm')]: {
    '& .MuiInputBase-input': {
      fontSize: '0.875rem',
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem', // Smaller font size on mobile
    padding: theme.spacing(1, 2), // Less padding on mobile
  },
}));

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserDetails } = useUser();
  const [isLogin, setIsLogin] = useState(location.pathname === "/register");
  const [loading, setLoading] = useState(true);
  const { toaster, setToaster, handleCloseToaster } = useToaster()

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const valid = await isTokenValid();
        if (valid) {
          const token = getToken();
          const decodedUser = decodeToken(token!)
          navigate(decodedUser!.type === 'student' ? "/student-personal-area" : "/my-students")
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location]);

  const toggleForm = () => {
    const newPath = isLogin ? "/register" : "/login";
    navigate(newPath);
    setIsLogin(!isLogin);
  };

  const handleSuccess = (token: string) => {
    storeToken(token);
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setUserDetails(decodedUser);
      setToaster({
        open: true,
        message: "התחברת בהצלחה.",
        color: "success"
      })
      navigate(decodedUser.type === 'student' ? "/student-personal-area" : "/my-students")
    } else {
      handleError("אירעה שגיאה בעיבוד פרטי המשתמש");
    }
  };

  const handleError = (errorMessage: string) => {
    setToaster({
      open: true,
      message: errorMessage,
      color: "error"
    })
  };

  const handleSubmit = async (data: UserCredentials | UserRegister) => {
    try {
      let token: string;
      if (isLogin) {
        token = await loginMutation.mutateAsync(data as UserCredentials);
      } else {
        token = await registerMutation.mutateAsync(data as UserRegister);
      }
      handleSuccess(token);
    } catch (error) {
      handleError(
        isLogin
          ? "נראה שהסיסמה/אימייל שגויים."
          : "ההרשמה נכשלה, בבקשה נסה שנית."
      );
    }
  };

  if (loading || loginMutation.isPending || registerMutation.isPending) {
    return <CardSkeleton />;
  }

  return (
    <Box>
      <RotatingPaper isflipped={!isLogin} elevation={3}>
        <FrontSide>
          <Box>
            <LoginForm onSubmit={handleSubmit} InputField={InputField} />
            <ButtonContainer>
              <StyledButton
                variant="contained"
                color="primary"
                type="submit"
                form="login-form"
              >
                התחבר
              </StyledButton>
              <StyledButton onClick={toggleForm}>להרשמה</StyledButton>
            </ButtonContainer>
          </Box>
        </FrontSide>
        <BackSide>
          <Box>
            <RegisterForm onSubmit={handleSubmit} InputField={InputField} />
            <ButtonContainer>
              <StyledButton
                variant="contained"
                color="primary"
                type="submit"
                form="register-form"
              >
                הרשם
              </StyledButton>
              <StyledButton onClick={toggleForm}>להתחברות</StyledButton>
            </ButtonContainer>
          </Box>
        </BackSide>
      </RotatingPaper>
      {toaster.open && (
        <Toaster 
          message={toaster.message}
          open={toaster.open}
          color={toaster.color}
          onClose={handleCloseToaster}
        />
      )}
    </Box>
  );
};

export default withFade(AuthForm);