// LessonList.tsx
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface LessonListProps {
  lessons: LessonDetails[];
  studentLessons: LessonDetails[] | undefined;
  onLessonClick: (lessonId: string, isAssociated: boolean) => void;
  onDisassociate: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, studentLessons, onLessonClick, onDisassociate }) => (
  <Box sx={{ height: '300px', overflowY: 'auto' }}>
    <List>
      {lessons.map((lesson) => {
        const isAssigned = studentLessons?.some(l => l.id === lesson.id) || false;
        return (
          <ListItem
            key={lesson.id}
            sx={{
              backgroundColor: isAssigned ? 'rgba(0, 255, 0, 0.1)' : 'inherit',
              '&:hover': {
                backgroundColor: isAssigned ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 0, 0, 0.04)',
              },
              border: '1px solid #D3D3D3',
              borderRadius: '4px',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '16px',
            }}
          >
            {isAssigned && (
              <IconButton 
                edge="start" 
                aria-label="delete" 
                onClick={() => onDisassociate(lesson.id!!)}
                sx={{ marginRight: 'auto', order: -1 }} 
              >
                <DeleteIcon />
              </IconButton>
            )}
            <ListItemText
              primary={lesson.title}
              secondary={isAssigned ? 'כבר הוקצה' : ''}
              onClick={() => !isAssigned && onLessonClick(lesson.id!!, isAssigned)}
              sx={{ 
                cursor: isAssigned ? 'default' : 'pointer',
                flex: 1,
                textAlign: 'right',
              }}
            />
          </ListItem>
        );
      })}
    </List>
  </Box>
);

export default LessonList;