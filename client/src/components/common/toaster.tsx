import { forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type ToasterProps = {
  message: string;
  open: boolean;
  color: "success" | "error";
  onClose: () => void;
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toaster = ({ message, open, color, onClose }: ToasterProps) => {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
      <Alert onClose={onClose} severity={color}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toaster;
