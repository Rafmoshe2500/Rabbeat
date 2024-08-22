import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const AnalysisContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  position: "relative",
  width: "100%",
  height: "300px",
}));

const ProcessingBar = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "5px",
  backgroundColor: theme.palette.grey[300],
  position: "relative",
  overflow: "hidden",
}));

const Bar = styled(Box)(({ theme }) => ({
  width: "20%",
  height: "100%",
  backgroundColor: theme.palette.primary.main,
  position: "absolute",
  animation: "moveBar 3s linear infinite",
  "@keyframes moveBar": {
    "0%": {
      left: "-20%",
    },
    "100%": {
      left: "100%",
    },
  },
}));

const AnalysisLoader: React.FC = () => {
  return (
    <AnalysisContainer elevation={3}>
      <Typography variant="h4" align="center" gutterBottom sx={{direction: 'rtl'}}>
        מנתח את הנתונים, זה עלול לקחת מספר דקות.
      </Typography>
      <ProcessingBar>
        <Bar />
      </ProcessingBar>
    </AnalysisContainer>
  );
};

export default AnalysisLoader;
