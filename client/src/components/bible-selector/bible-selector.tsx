import { useReducer } from "react";
import { Bible } from "../../constants/bible.constants";
import AutoWidthSelect from "../select/auto-width-select";
import styles from "./bible-selector.module.scss";

type State = {
  book: string;
  fromChapter: string;
  fromVerse: string;
  toChapter: string;
  toVerse: string;
};

type Action =
  | { type: "SET_BOOK"; payload: string }
  | { type: "SET_FROM_CHAPTER"; payload: string }
  | { type: "SET_FROM_VERSE"; payload: string }
  | { type: "SET_TO_CHAPTER"; payload: string }
  | { type: "SET_TO_VERSE"; payload: string };

const initialState: State = {
  book: "",
  fromChapter: "",
  fromVerse: "",
  toChapter: "",
  toVerse: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_BOOK":
      return {
        ...state,
        book: action.payload,
        fromChapter: "",
        fromVerse: "",
        toChapter: "",
        toVerse: "",
      };
    case "SET_FROM_CHAPTER":
      return {
        ...state,
        fromChapter: action.payload,
        fromVerse: "",
        toChapter: "",
        toVerse: "",
      };
    case "SET_FROM_VERSE":
      return {
        ...state,
        fromVerse: action.payload,
        toChapter: "",
        toVerse: "",
      };
    case "SET_TO_CHAPTER":
      return { ...state, toChapter: action.payload, toVerse: "" };
    case "SET_TO_VERSE":
      return { ...state, toVerse: action.payload };
    default:
      return state;
  }
};

const BibleSelector = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { book, fromChapter, fromVerse, toChapter, toVerse } = state;

  const selectedBook = Bible.find((b) => b.name === book);
  const chapters = selectedBook ? selectedBook.chapters : [];
  const fromChapterObject = chapters.find((c) => c.name === fromChapter);
  const fromVerses = fromChapterObject ? fromChapterObject.verses : [];
  const toChapterObject = chapters.find((c) => c.name === toChapter);
  const toVerses = toChapterObject ? toChapterObject.verses : [];

  return (
    <div className={styles["selectors-container"]}>
      <AutoWidthSelect
        label="ספר"
        value={book}
        options={Bible.map((b) => b.name)}
        onChange={(e) =>
          dispatch({ type: "SET_BOOK", payload: e.target.value as string })
        }
      />

      {book && (
        <AutoWidthSelect
          label="מפרק"
          value={fromChapter}
          options={chapters.map((ch) => ch.name)}
          onChange={(e) =>
            dispatch({
              type: "SET_FROM_CHAPTER",
              payload: e.target.value as string,
            })
          }
        />
      )}

      {fromChapter && (
        <AutoWidthSelect
          label="פסוק"
          value={fromVerse}
          options={fromVerses}
          onChange={(e) =>
            dispatch({
              type: "SET_FROM_VERSE",
              payload: e.target.value as string,
            })
          }
        />
      )}

      {fromVerse && (
        <AutoWidthSelect
          label="עד פרק"
          value={toChapter}
          options={chapters.map((ch) => ch.name)}
          onChange={(e) =>
            dispatch({
              type: "SET_TO_CHAPTER",
              payload: e.target.value as string,
            })
          }
        />
      )}

      {toChapter && (
        <AutoWidthSelect
          label="פסוק"
          value={toVerse}
          options={toVerses}
          onChange={(e) =>
            dispatch({
              type: "SET_TO_VERSE",
              payload: e.target.value as string,
            })
          }
        />
      )}

      <div>
        <h3>מוצג</h3>
        <p>
          ספר: {book}, מ: {fromChapter}:{fromVerse}, ועד: {toChapter}:{toVerse}
        </p>
      </div>
    </div>
  );
};

export default BibleSelector;
