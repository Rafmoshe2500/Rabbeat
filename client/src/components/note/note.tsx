import React, { useState } from "react";
import "./note.css";

interface NoteProps {
  id: number;
  initialText: string;
  timestamp: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
  onClick: (timestamp: number) => void;
}

const Note = ({
  id,
  initialText,
  timestamp,
  onDelete,
  onUpdate,
  onClick,
}: NoteProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [text, setText] = useState<string>(initialText);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(id, text);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="note" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span style={{ direction: "rtl" }} onClick={() => onClick(timestamp)}>
          {text} (זמן {new Date(timestamp * 1000).toISOString().substr(11, 8)})
        </span>
      )}
      <button className="delete-button" onClick={handleDelete}>
        x
      </button>
    </div>
  );
};

export default Note;
