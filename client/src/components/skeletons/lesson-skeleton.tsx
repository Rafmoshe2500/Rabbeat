import { Box, Skeleton } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
});

function LessonSkeleton() {
  return (
    <ThemeProvider theme={theme}>
      <Box dir="rtl" sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", mb: 2 }}>
          <Skeleton variant="rectangular" width={200} height={36} />
        </Box>

        <Box sx={{ display: "flex", mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ mx: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ mx: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ mx: 1 }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default LessonSkeleton;
