import { Box, Skeleton, ThemeProvider } from "@mui/material";
import theme from "../../theme";

function SelfTestSkeleton() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2, direction: "rtl" }}>
        <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />

        {[...Array(10)].map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width="100%"
            height={24}
            sx={{ mb: 1 }}
          />
        ))}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ mx: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={36}
            sx={{ mx: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={36}
            sx={{ mx: 1 }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SelfTestSkeleton;
