import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import "./lesson-tesr.css";
import Note from "./note/note";
import Panel from "./panel/panel";
import styles from "./lesson-test.module.css";

interface TranslatorLibraryProps {
  lesson?: Lesson;
}

interface NoteData {
  id: number;
  timestamp: number;
  text: string;
}

const TranslatorLibrary: React.FC<TranslatorLibraryProps> = ({ lesson }) => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);

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
    console.log("timeUpdate", audioRef?.current?.currentTime);

    if (audioRef.current && lesson?.highlightsTimestamps) {
      const currentTime = audioRef.current.currentTime;
      const wordIndex =
        lesson.highlightsTimestamps.findIndex(
          (timestamp) => currentTime < timestamp
        ) - 1;
      console.log({ wordIndex });
      console.log(words[wordIndex]);

      setCurrentWordIndex(
        wordIndex >= 0 ? wordIndex : lesson.highlightsTimestamps.length - 1
      );
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

  const words = lesson?.text.split(" ") || [];

  return (
    <div>
      <Panel>
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

        <div>
          <div className={styles["stam-font"]}>
            {words.map((word, index) => (
              <span
                key={index}
                className={
                  index === currentWordIndex ? styles["highlight"] : ""
                }
              >
                {word}{" "}
              </span>
            ))}
          </div>
        </div>

        <div>
          <button onClick={addNote}>Add Note</button>
        </div>
      </div>
    </div>
  );
};

export default TranslatorLibrary;

// import React, { useState, useRef, useEffect } from "react";
// import "regenerator-runtime/runtime";
// import "./lesson-tesr.css";
// import Note from "./note/note";
// import Panel from "./panel/panel";

// interface TranslatorLibraryProps {
//   lesson?: Lesson;
// }

// interface NoteData {
//   id: number;
//   timestamp: number;
//   text: string;
// }

// const TranslatorLibrary: React.FC<TranslatorLibraryProps> = ({ lesson }) => {
//   const [notes, setNotes] = useState<NoteData[]>([]);
//   const [audioURL, setAudioURL] = useState<string | null>(null);

//   const audioRef = useRef<HTMLAudioElement>(null);
//   const noteIdRef = useRef<number>(0);

//   useEffect(() => {
//     if (lesson?.audio) {
//       const url = URL.createObjectURL(lesson.audio);
//       setAudioURL(url);

//       return () => {
//         URL.revokeObjectURL(url); // Cleanup the URL object when the component is unmounted
//       };
//     }
//   }, [lesson?.audio]);

//   const addNote = () => {
//     if (audioRef.current) {
//       const timestamp = audioRef.current.currentTime;
//       const newNote: NoteData = {
//         id: noteIdRef.current++,
//         timestamp,
//         text: "currentTranscript",
//       };
//       setNotes([...notes, newNote]);
//       // resetTranscript();
//     }
//   };

//   const handleNoteClick = (timestamp: number) => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = timestamp;
//       audioRef.current.play();
//     }
//   };

//   const handleDeleteNote = (id: number) => {
//     setNotes(notes.filter((note) => note.id !== id));
//   };

//   const handleUpdateNote = (id: number, newText: string) => {
//     setNotes(
//       notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
//     );
//   };

//   return (
//     <div>
//       <Panel>
//         {notes.map((note) => (
//           <Note
//             key={note.id}
//             id={note.id}
//             initialText={""}
//             timestamp={note.timestamp}
//             onDelete={handleDeleteNote}
//             onUpdate={handleUpdateNote}
//             onClick={handleNoteClick}
//           />
//         ))}
//       </Panel>

//       <div>
//         {audioURL && (
//           <audio ref={audioRef} controls>
//             <source src={audioURL} type="audio/wav" />
//             Your browser does not support the audio element.
//           </audio>
//         )}

//         <div>
//           <div>הטקסט הרצוי הינו: {lesson?.text}</div>
//         </div>

//         <div>
//           <button onClick={addNote}>Add Note</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TranslatorLibrary;
