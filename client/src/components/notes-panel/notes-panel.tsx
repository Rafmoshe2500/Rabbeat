import React, { useState, useRef } from "react";
import Note from "../note/note";
import { Box, Button, Typography } from "@mui/material";
import {
  useLessonNotes,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "../../hooks/notes";
import { useUser } from "../../contexts/user-context";
import { NoteAdd } from "@mui/icons-material";

interface NotesPanelProps {
  lessonId: string;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ lessonId, audioRef }) => {
  const { userDetails } = useUser();
  const { data: notes, refetch: refetchNotes } = useLessonNotes(
    lessonId,
    userDetails!.id!
  );
  const { mutate: createNote } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNote } = useUpdateNote();
  const [tempNote, setTempNote] = useState<{ id: string; time: number } | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const addNote = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      const tempId = `temp-${Date.now()}`;
      setTempNote({ id: tempId, time });
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
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
    if (tempNote && tempNote.id === noteId) {
      createNote(
        {
          userId: userDetails?.id!,
          lessonId: lessonId,
          time: tempNote.time,
          text: newText,
        },
        {
          onSuccess: () => {
            setTempNote(null);
            refetchNotes();
          },
        }
      );
    } else {
      updateNote({ noteId, newText });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        margin: "20px auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          p: 2,
          mb: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={addNote}>
          <NoteAdd />
        </Button>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          ההערות שלי
        </Typography>
        <Box
          ref={scrollRef}
          sx={{ maxHeight: "300px", overflowY: "auto", mb: 2 }}
        >
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
          {tempNote && (
            <Note
              key={tempNote.id}
              id={tempNote.id}
              initialText=""
              time={tempNote.time}
              onDelete={() => setTempNote(null)}
              onUpdate={handleUpdateNote}
              onClick={handleNoteClick}
              isEditable={true}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NotesPanel;
