import React from "react";
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const CardSkeleton: React.FC = () => (
  <Card sx={{ m: 1, direction: "rtl" }}>
    <CardContent>
      <Skeleton
        variant="circular"
        width={20}
        height={20}
        sx={{ position: "absolute", top: 10, left: 10 }}
      />
      <Skeleton variant="text" width="80%" height={40} />
      <Box sx={{ mt: 2 }}>
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              sx={{ ml: 1 }}
            />
            <Skeleton variant="text" width="60%" />
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

const CardGridSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container spacing={2}>
      {[...Array(isMobile ? 3 : 16)].map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={3}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGridSkeleton;
