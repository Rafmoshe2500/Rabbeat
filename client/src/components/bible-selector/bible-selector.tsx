import { useEffect, useReducer } from "react";
import { Bible } from "../../constants/bible.constants";
import AutoWidthSelect from "../select/auto-width-select";
import styles from "./bible-selector.module.css";
import { useTorahSection } from "../../hooks/useTorahSection";
import Chapter from "../bible-displayer/chapter";
import gematriya from "gematriya";
import { Box, Typography } from "@mui/material";
import TextContainer from "../common/text-container";

type BibleSelectorProps = {
  setTorahSection: any;
};

type State = {
  pentateuch: string;
  startChapter: string;
  startVerse: string;
  endChapter: string;
  endVerse: string;
};

type Action =
  | { type: "SET_BOOK"; payload: string }
  | { type: "SET_FROM_CHAPTER"; payload: string }
  | { type: "SET_FROM_VERSE"; payload: string }
  | { type: "SET_TO_CHAPTER"; payload: string }
  | { type: "SET_TO_VERSE"; payload: string };

const initialState: State = {
  pentateuch: "",
  startChapter: "",
  startVerse: "",
  endChapter: "",
  endVerse: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BOOK":
      return {
        ...state,
        pentateuch: action.payload,
        startChapter: "",
        startVerse: "",
        endChapter: "",
        endVerse: "",
      };
    case "SET_FROM_CHAPTER":
      return {
        ...state,
        startChapter: action.payload,
        startVerse: "",
        endChapter: "",
        endVerse: "",
      };
    case "SET_FROM_VERSE":
      return {
        ...state,
        startVerse: action.payload,
        endChapter: "",
        endVerse: "",
      };
    case "SET_TO_CHAPTER":
      return { ...state, endChapter: action.payload, endVerse: "" };
    case "SET_TO_VERSE":
      return { ...state, endVerse: action.payload };
    default:
      return state;
  }
};

const BibleSelector = ({ setTorahSection }: BibleSelectorProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { pentateuch, startChapter, startVerse, endChapter, endVerse } = state;

  useEffect(() => {
    setTorahSection({
      ...state,
    });
  }, [state.endVerse]);

  const selectedBook = Bible.find((b) => b.name === pentateuch);
  const chapters = selectedBook ? selectedBook.chapters : [];
  const fromChapterObject =
    chapters[gematriya(startChapter, { order: true }) - 1];
  const fromVerses = fromChapterObject ? fromChapterObject.verses : [];
  const toChapterObject = chapters[gematriya(endChapter, { order: true }) - 1];
  const toVerses = toChapterObject ? toChapterObject.verses : [];

  const { data, isLoading, error } = useTorahSection(
    pentateuch,
    startChapter,
    startVerse,
    endChapter,
    endVerse
  );

  return (
    <div>
      <div className={styles["selectors-container"]}>
        <AutoWidthSelect
          label="חומש"
          value={pentateuch}
          options={Bible.map((b) => b.name)}
          onChange={(e) =>
            dispatch({ type: "SET_BOOK", payload: e.target.value })
          }
        />

        {pentateuch && (
          <AutoWidthSelect
            label="מפרק"
            value={startChapter}
            options={chapters.map((_, index) =>
              gematriya(index + 1, { geresh: false, punctuate: false })
            )}
            onChange={(e) =>
              dispatch({
                type: "SET_FROM_CHAPTER",
                payload: e.target.value,
              })
            }
          />
        )}

        {startChapter && (
          <AutoWidthSelect
            label="פסוק"
            value={startVerse}
            options={fromVerses}
            onChange={(e) =>
              dispatch({
                type: "SET_FROM_VERSE",
                payload: e.target.value,
              })
            }
          />
        )}

        {startVerse && (
          <AutoWidthSelect
            label="עד פרק"
            value={endChapter}
            options={chapters.slice(gematriya(startChapter)).map((_, index) =>
              gematriya(index + gematriya(startChapter), {
                geresh: false,
                punctuate: false,
              })
            )}
            onChange={(e) =>
              dispatch({
                type: "SET_TO_CHAPTER",
                payload: e.target.value,
              })
            }
          />
        )}

        {endChapter && (
          <AutoWidthSelect
            label="פסוק"
            value={endVerse}
            options={
              startChapter === endChapter
                ? toVerses.slice(gematriya(startVerse) - 1)
                : toVerses
            }
            onChange={(e) =>
              dispatch({
                type: "SET_TO_VERSE",
                payload: e.target.value,
              })
            }
          />
        )}
      </div>
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data</p>}

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

export default BibleSelector;
