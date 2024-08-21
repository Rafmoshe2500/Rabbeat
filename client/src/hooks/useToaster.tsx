import { useState } from "react";

const useToaster = () => {
  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    color: "success" as "success" | "error",
  });

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };

  return { toaster, setToaster, handleCloseToaster };
};

export default useToaster;
