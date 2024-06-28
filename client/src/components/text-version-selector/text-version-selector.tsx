import { useEffect, useState } from "react";

type Version = "none" | "nikud" | "teamim" | "both";

interface VersionSelectorProps {
  onVersionChange: (version: Version) => void;
}

const VersionSelector: React.FC<VersionSelectorProps> = ({
  onVersionChange,
}) => {
  const [nikudSelected, setNikudSelected] = useState(false);
  const [teamimSelected, setTeamimSelected] = useState(false);

  const handleNikudClick = () => {
    setNikudSelected(!nikudSelected);
  };

  const handleTeamimClick = () => {
    setTeamimSelected(!teamimSelected);
  };

  useEffect(() => {
    if (nikudSelected && teamimSelected) {
      onVersionChange("both");
    } else if (nikudSelected) {
      onVersionChange("nikud");
    } else if (teamimSelected) {
      onVersionChange("teamim");
    } else {
      onVersionChange("none");
    }
  }, [nikudSelected, teamimSelected, onVersionChange]);

  return (
    <div>
      <button
        onClick={handleNikudClick}
        className={nikudSelected ? "selected" : ""}
      >
        ניקוד
      </button>
      <button
        onClick={handleTeamimClick}
        className={teamimSelected ? "selected" : ""}
      >
        טעמי המקרא
      </button>
    </div>
  );
};

export default VersionSelector;
