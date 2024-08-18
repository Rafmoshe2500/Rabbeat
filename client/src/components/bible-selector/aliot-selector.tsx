import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import AutoWidthSelect from "../select/auto-width-select";
import styles from "./bible-selector.module.css";
import { UseAlia } from "../../hooks/useAlia";
import Chapter from "../bible-displayer/chapter";
import { BibleParashot, Aliot } from "../../constants/bible.constants";
import { useTorahSection } from "../../hooks/useTorahSection";

type BibleSelectorProps = {
  setTorahSection: any;
  setLessonTitle: (newTitle: string) => void;
};

const TextContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const BibleParashotSelector = ({
  setTorahSection,
  setLessonTitle,
}: BibleSelectorProps) => {
  const [book, setBook] = useState(Object.keys(BibleParashot)[0]);
  const [parasha, setParasha] = useState<string>("");
  const [alia, setAlia] = useState<string>("");

  const {
    data: aliaDetails,
    isLoading: isAliaDetailsLoading,
    error: isAliaDetailsError,
  } = UseAlia(parasha, alia);
  const { data, isLoading, error } = useTorahSection(
    aliaDetails?.pentateuch || "",
    aliaDetails?.startChapter || "",
    aliaDetails?.startVerse || "",
    aliaDetails?.endChapter || "",
    aliaDetails?.endVerse || ""
  );

  useEffect(() => {
    setParasha("");
  }, [book]);

  useEffect(() => {
    if (data) {
      setTorahSection({
        ...aliaDetails,
      });

      setLessonTitle(`${alia}, ${parasha}`);
    }
  }, [data]);

  return (
    <div>
      <div className={styles["selectors-container"]}>
        <AutoWidthSelect
          label="ספר"
          value={book}
          options={Object.keys(BibleParashot)}
          onChange={(e) => setBook(e.target.value)}
        />

        <Autocomplete
          value={parasha}
          onChange={(_, newValue) => setParasha(newValue ?? "")}
          options={BibleParashot[book as keyof typeof BibleParashot]}
          renderInput={(params) => <TextField {...params} label="פרשה" />}
          sx={{ width: 200 }}
        />

        <AutoWidthSelect
          label="עליה"
          value={alia || ""}
          options={Aliot}
          onChange={(e) => setAlia(e.target.value)}
        />
      </div>
      <div>
        {(isLoading || isAliaDetailsLoading) && <p>Loading...</p>}
        {(error || isAliaDetailsError) && <p>Error loading data</p>}

        {data && (
          <TextContainer>
            <Box
              sx={{
                height: 400,
                overflow: "auto",
                overflowX: "hidden",
                p: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body1"
                component="div"
                sx={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1.25rem",
                  direction: "rtl",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {Object.entries(data.both).map(([chapterKey, chapter]) => (
                  <Chapter
                    key={chapterKey}
                    chapterKey={chapterKey}
                    chapter={chapter}
                  />
                ))}
              </Typography>
            </Box>
          </TextContainer>
        )}
      </div>
    </div>
  );
};

export default BibleParashotSelector;
