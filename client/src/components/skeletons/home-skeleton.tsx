import React from "react";
import { Box, Skeleton, Card, CardContent, Typography } from "@mui/material";

const HomeSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            direction: "rtl",
          }}
        >
          <Skeleton variant="text" width="60%" height={40} />
          <Typography variant="subtitle1">
            <Skeleton width="40%" />
          </Typography>

          {[...Array(6)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HomeSkeleton;
