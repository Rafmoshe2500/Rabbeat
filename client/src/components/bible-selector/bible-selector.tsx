import { useState } from "react";
import { Bible } from "../../constants/bible.constants";
import AutoWidthSelect from "../select/auto-width-select";
import styles from "./bible-selector.module.scss";

const BibleSelector = () => {
  const [book, setBook] = useState<string>("");
  const [fromChapter, setFromChapter] = useState<string>("");
  const [fromVerse, setFromVerse] = useState<string>("");
  const [toChapter, setToChapter] = useState<string>("");
  const [toVerse, setToVerse] = useState<string>("");

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
        onChange={(e) => setBook(e.target.value as string)}
      />

      {book && (
        <AutoWidthSelect
          label="מפרק"
          value={fromChapter}
          options={chapters.map((ch) => ch.name)}
          onChange={(e) => setFromChapter(e.target.value as string)}
        />
      )}

      {fromChapter && (
        <AutoWidthSelect
          label="פסוק"
          value={fromVerse}
          options={fromVerses}
          onChange={(e) => setFromVerse(e.target.value as string)}
        />
      )}

      {fromVerse && (
        <AutoWidthSelect
          label="עד פרק"
          value={toChapter}
          options={chapters.map((ch) => ch.name)}
          onChange={(e) => setToChapter(e.target.value as string)}
        />
      )}

      {toChapter && (
        <AutoWidthSelect
          label="פסוק"
          value={toVerse}
          options={toVerses}
          onChange={(e) => setToVerse(e.target.value as string)}
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
