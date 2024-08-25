import React from 'react';
import { TextField } from "@mui/material";
import Loader from "../common/loader";
import LessonList from './display-lessons';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';

interface OpenLessonDialogContentProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  filteredLessons: LessonDetails[];
  studentLessons: LessonDetails[] | undefined;
  onLessonClick: (lessonId: string, isAssociated: boolean) => void;
  onDisassociate: (lessonId: string) => void;
}

const OpenLessonDialogContent: React.FC<OpenLessonDialogContentProps> = ({
  searchTerm,
  onSearchChange,
  isLoading,
  filteredLessons,
  studentLessons,
  onLessonClick,
  onDisassociate,
}) => (
  <>
    <TextField
      autoFocus
      margin="dense"
      label="חיפוש שיעורים"
      type="text"
      fullWidth
      variant="outlined" // Changed to outlined for better visibility
      value={searchTerm}
      onChange={onSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }} // Add some margin at the bottom
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

export default OpenLessonDialogContent;