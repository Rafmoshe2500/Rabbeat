import React, { useState, useRef, useEffect } from "react";
import "regenerator-runtime/runtime";
import "./lesson-content.module.css";
import NotesPanel from "../../notes-panel/notes-panel";
import HighlightedText from "../../highlighted-text/highlighted-text";

interface LessonContentProps {
  lesson?: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [asd, setAsd] = useState("asd");

  useEffect(() => {
    if (lesson?.audio) {
      const url = URL.createObjectURL(lesson.audio);
      setAudioURL(url);

      return () => {
        URL.revokeObjectURL(url); // Cleanup the URL object when the component is unmounted
      };
    }
  }, [lesson?.audio]);

  useEffect(() => {
    setAsd("qwe");
  }, [audioURL]);

  return (
    <div>
      <NotesPanel lessonId={lesson!.id!} audioRef={audioRef} />

      <div>
        {audioURL && (
          <audio ref={audioRef} controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}

        <HighlightedText key={asd} lesson={lesson!} audioRef={audioRef} />
      </div>
    </div>
  );
};

export default LessonContent;
