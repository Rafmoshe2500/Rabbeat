import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

type LoaderProps = {
  message?: string;
};

const Loader = ({ message }: LoaderProps) => {
  return (
    <Box>
      <CircularProgress dir="rtl" />
      <br/>
      {message}
    </Box>
  );
};

export default Loader;
