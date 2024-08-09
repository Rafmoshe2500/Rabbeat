import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Box } from "@mui/material";

type Version = "none" | "nikud" | "teamim" | "both";

interface VersionSelectorProps {
  onVersionChange: (version: Version) => void;
  onTorahFontChange: (isEnabled: boolean) => void;
}

const VersionSelector: React.FC<VersionSelectorProps> = ({
  onVersionChange,
  onTorahFontChange,
}) => {
  const [nikudSelected, setNikudSelected] = useState(false);
  const [teamimSelected, setTeamimSelected] = useState(false);
  const [torahFontEnabled, setTorahFontEnabled] = useState(false);
  const handleNikudClick = () => {
    setNikudSelected(!nikudSelected);
  };

  const handleTeamimClick = () => {
    setTeamimSelected(!teamimSelected);
  };

  const handleTorahFontClick = () => {
    setTorahFontEnabled(!torahFontEnabled);
  };

  useEffect(() => {
    if (torahFontEnabled) {
      onTorahFontChange(true);
    } else {
      onTorahFontChange(false);
      if (nikudSelected && teamimSelected) {
        onVersionChange("both");
      } else if (nikudSelected) {
        onVersionChange("nikud");
      } else if (teamimSelected) {
        onVersionChange("teamim");
      } else {
        onVersionChange("none");
      }
    }
  }, [
    nikudSelected,
    teamimSelected,
    torahFontEnabled,
    onVersionChange,
    onTorahFontChange,
  ]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={2}
      sx={{ backgroundColor: 'inherit' }}
    >
      <ButtonGroup
        variant="contained"
        style={{
          marginBottom: "10px",
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button
          onClick={handleNikudClick}
          variant={nikudSelected ? "contained" : "outlined"}
          disabled={torahFontEnabled}
        >
          ניקוד
        </Button>
        <Button
          onClick={handleTeamimClick}
          variant={teamimSelected ? "contained" : "outlined"}
          disabled={torahFontEnabled}
        >
          טעמי המקרא
        </Button>
        <Button
          variant={torahFontEnabled ? "contained" : "outlined"}
          onClick={handleTorahFontClick}
        >
          תורה אמיתית
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default VersionSelector;
