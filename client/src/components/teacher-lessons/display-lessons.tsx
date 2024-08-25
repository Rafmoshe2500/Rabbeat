import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface LessonListProps {
  lessons: LessonDetails[];
  studentLessons: LessonDetails[] | undefined;
  onLessonClick: (lessonId: string, isAssociated: boolean) => void;
  onDisassociate: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  studentLessons,
  onLessonClick,
  onDisassociate,
}) => {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {lessons.map((lesson) => {
        const isAssociated = studentLessons?.some((sl) => sl.id === lesson.id);
        return (
          <ListItem
            key={lesson.id}
            sx={{
              mb: 1,
              borderRadius: 1,
              border: '2px solid',
              borderColor: 'grey.300',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <IconButton
                edge="start"
                aria-label={isAssociated ? 'disassociate' : 'associate'}
                onClick={() =>
                  isAssociated
                    ? onDisassociate(lesson.id!)
                    : onLessonClick(lesson.id!, false)
                }
              >
                {isAssociated ? (
                  <RemoveCircleOutlineIcon sx={{ color: 'error.main' }} />
                ) : (
                  <AddCircleOutlineIcon sx={{ color: 'primary.main' }} />
                )}
              </IconButton>
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1" component="div">
                  {lesson.title}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default LessonList;
