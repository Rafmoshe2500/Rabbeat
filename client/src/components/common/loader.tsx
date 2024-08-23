import Box from "@mui/material/Box";
import BookLoader from "./book-loader";

type LoaderProps = {
  message?: string;
};

const Loader = ({ message }: LoaderProps) => {
  return (
    <Box>
      <BookLoader />
      <br/>
      <div dir="rtl">{message}</div>
    </Box>
  );
};

export default Loader;
