import React from 'react';
import { TextField } from "@mui/material";
import Loader from "../common/loader";
import LessonList from './display-lessons';

interface DialogContentProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  filteredLessons: LessonDetails[];
  studentLessons: LessonDetails[] | undefined;
  onLessonClick: (lessonId: string, isAssociated: boolean) => void;
  onDisassociate: (lessonId: string) => void;
}

const DialogContent: React.FC<DialogContentProps> = ({
  searchTerm,
  onSearchChange,
  isLoading,
  filteredLessons,
  studentLessons,
  onLessonClick,
  onDisassociate
}) => (
  <>
    <TextField
      autoFocus
      margin="dense"
      label="חיפוש שיעורים"
      type="text"
      fullWidth
      variant="standard"
      value={searchTerm}
      onChange={onSearchChange}
    />
    {isLoading ? (
      <Loader message="טוען שיעורים..." />
    ) : (
      <LessonList
        lessons={filteredLessons}
        studentLessons={studentLessons}
        onLessonClick={onLessonClick}
        onDisassociate={onDisassociate}
      />
    )}
  </>
);

export default DialogContent;