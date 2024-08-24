import { useState } from "react";

type NotificationState = {
  isOpen: boolean;
  message: string[];
  severity: "success" | "error" | "info" | "warning";
};

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: [],
    severity: "info",
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return { notification, setNotification, handleCloseNotification };
};

export default useNotification;
