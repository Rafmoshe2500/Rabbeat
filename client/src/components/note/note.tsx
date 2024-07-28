import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface NoteProps {
  id: string;
  initialText: string;
  time: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
  onClick: (timestamp: number) => void;
  isEditable?: boolean;
}

const Note: React.FC<NoteProps> = ({
  id,
  initialText,
  time,
  onDelete,
  onUpdate,
  onClick,
  isEditable = false,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(isEditable);
  const [text, setText] = useState<string>(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() !== "") {
      onUpdate(id, text);
    } else {
      onDelete(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        mb: 1,
        boxShadow: 1,
        "&:hover": {
          boxShadow: 3,
        },
        transition: "box-shadow 0.3s",
      }}
    >
      {isEditing ? (
        <TextField
          inputRef={inputRef}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          fullWidth
          variant="outlined"
          size="small"
        />
      ) : (
        <Typography
          onClick={() => onClick(time)}
          sx={{ flexGrow: 1, direction: "rtl", cursor: "pointer" }}
        >
          {text} (זמן {new Date(time * 1000).toISOString().substr(11, 8)})
        </Typography>
      )}
      {!isEditing && (
        <IconButton onClick={handleEditClick} size="small" sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
      )}
      <IconButton onClick={handleDelete} size="small">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default Note;
