import React, { useState } from "react";
import "./note.css";

interface NoteProps {
  id: string;
  initialText: string;
  time: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
  onClick: (timestamp: number) => void;
}

const Note = ({
  id,
  initialText,
  time,
  onDelete,
  onUpdate,
  onClick,
}: NoteProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
        <span style={{ direction: "rtl" }} onClick={() => onClick(time)}>
          {text} (זמן {new Date(time * 1000).toISOString().substr(11, 8)})
        </span>
      )}
      <button className="delete-button" onClick={handleDelete}>
        x
      </button>
    </div>
  );
};

export default Note;
