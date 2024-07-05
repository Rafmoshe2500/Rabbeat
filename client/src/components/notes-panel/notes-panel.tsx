import React from "react";
import Note from "../note/note";
import Panel from "../panel/panel";
import {
  useLessonNotes,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "../../hooks/notes";
import { useUser } from "../../contexts/user-context";

interface NotesPanelProps {
  lessonId: string;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ lessonId, audioRef }) => {
  const { userDetails } = useUser();
  const { data: notes } = useLessonNotes(lessonId, userDetails!.id!);
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();

  const addNote = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      const newNote = {
        userId: userDetails?.id!,
        lessonId: lessonId,
        time,
        text: "",
      };
      createNote(newNote);
    }
  };

  const handleNoteClick = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
      audioRef.current.play();
    }
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleUpdateNote = (noteId: string, newText: string) => {
    updateNote({ noteId, newText });
  };

  return (
    <>
      <Panel header="ההערות שלי">
        {notes?.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            initialText={note.text}
            time={note.time}
            onDelete={handleDeleteNote}
            onUpdate={handleUpdateNote}
            onClick={handleNoteClick}
          />
        ))}
      </Panel>
      <button onClick={addNote}>Add Note</button>
    </>
  );
};

export default NotesPanel;
