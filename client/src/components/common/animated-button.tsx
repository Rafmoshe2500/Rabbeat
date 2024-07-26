import React, { useState } from "react";
import { Button, CircularProgress, Zoom, Fade } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green } from "@mui/material/colors";

interface AnimatedButtonProps {
  onClick: () => Promise<void>;
  buttonText: string;
  isLoading: boolean;
  successDuration?: number;
  loadingSize?: number;
  successIconSize?: number;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  buttonText,
  isLoading,
  successDuration = 3000,
  loadingSize = 24,
  successIconSize = 32,
  variant = "contained",
  color = "primary",
}) => {
  const [success, setSuccess] = useState(false);
  const [show, setShow] = useState<boolean>(true);

  const handleClick = async () => {
    try {
      await onClick();
      setSuccess(true);
      setTimeout(() => {
        setShow(false);
      }, successDuration);
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <>
      {show && (
        <Fade in={!success} timeout={successDuration}>
          <Button
            variant={variant}
            color={color}
            onClick={handleClick}
            disabled={isLoading || success}
            sx={{
              minWidth: 150,
              minHeight: 40,
              position: "relative",
            }}
          >
            {isLoading ? (
              <CircularProgress size={loadingSize} />
            ) : success ? (
              <Zoom in={success} timeout={500}>
                <CheckCircleIcon
                  sx={{ color: green[500], fontSize: successIconSize }}
                />
              </Zoom>
            ) : (
              buttonText
            )}
          </Button>
        </Fade>
      )}
    </>
  );
};

export default AnimatedButton;
