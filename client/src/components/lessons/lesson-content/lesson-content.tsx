import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import "./lesson-content.module.css";
import Note from "../../note/note";
import Panel from "../../panel/panel";
import styles from "./lesson-content.module.css";
import { Box, Container } from "@mui/material";
import Chapter from "../../bible-displayer/chapter";
import { findWord } from "../../../utils/utils";

interface LessonContentProps {
  lesson?: LessonForView;
}

interface NoteData {
  id: number;
  timestamp: number;
  text: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [wordToMArk, setWordToMark] = useState<WordToMark>();

  const audioRef = useRef<HTMLAudioElement>(null);
  const noteIdRef = useRef<number>(0);
  useEffect(() => {
    if (lesson?.audio) {
      const url = URL.createObjectURL(lesson.audio);
      setAudioURL(url);

      return () => {
        URL.revokeObjectURL(url); // Cleanup the URL object when the component is unmounted
      };
    }
  }, [lesson?.audio]);

  const addNote = () => {
    if (audioRef.current) {
      const timestamp = audioRef.current.currentTime;
      const newNote: NoteData = {
        id: noteIdRef.current++,
        timestamp,
        text: "currentTranscript",
      };
      setNotes([...notes, newNote]);
      // resetTranscript();
    }
  };

  const handleNoteClick = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
      audioRef.current.play();
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleUpdateNote = (id: number, newText: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && lesson?.highlightsTimestamps?.length) {
      const currentTime = audioRef.current.currentTime;
      const wordIndex =
        lesson.highlightsTimestamps.findIndex(
          (timestamp) => currentTime < timestamp
        ) - 1;

      setWordToMark(findWord(lesson!.text!.nikud, wordIndex));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [audioURL]);

  return (
    <div>
      <Panel header="ההערות שלי">
        {notes.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            initialText={""}
            timestamp={note.timestamp}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
            onClick={handleNoteClick}
          />
        ))}
      </Panel>

      <div>
        {audioURL && (
          <audio ref={audioRef} controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* <Container maxWidth="sm">
        <Box className="stam-font" sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>
        </Box>
      </Container> */}

        <Container maxWidth="sm">
          <Box
            className={`${styles["text"]} stam-font`}
            sx={{ bgcolor: "#cfe8fc" }}
          >
            {lesson?.text && (
              <div>
                {/* TODO: extract to another componentttttttttttttttttttttttttttttttttttttttttttttttttttt */}
                {Object.entries(lesson?.text.both).map(
                  ([chapterKey, chapter]) => (
                    <Chapter
                      key={chapterKey}
                      chapterKey={chapterKey}
                      chapter={chapter}
                      wordToMark={
                        wordToMArk?.chapter === chapterKey
                          ? wordToMArk
                          : undefined
                      }
                    />
                  )
                )}
              </div>
            )}
          </Box>
        </Container>

        <div>
          <button onClick={addNote}>Add Note</button>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
