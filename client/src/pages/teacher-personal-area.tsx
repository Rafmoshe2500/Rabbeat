import React, { useState, useEffect } from 'react';
import { useLessonsDetailsByUser } from '../hooks/lessons/useLessonsDetailsByUser';
import { useUser } from '../contexts/user-context';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/loader';
import DisplayCards from '../components/common/display-cards/display-cards';
import {
  useMediaQuery,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import LessonCard from '../components/lessons/lesson-card/lesson-card';
import withFade from '../hoc/withFade.hoc';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import FloatingActionButton from '../components/common/floating-action-button';
import DialogComponent from '../components/common/dialog';
import { useDeleteLesson } from '../hooks/lessons/useDeleteLesson';
import useToaster from '../hooks/useToaster';
import Toaster from '../components/common/toaster';

const TeacherPersonalArea = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useLessonsDetailsByUser(userDetails!.id);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const viewMode = isSmallScreen ? 'list' : 'grid';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPentateuch, setSelectedPentateuch] = useState('all');
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteLesson } = useDeleteLesson();
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  useEffect(() => {
    if (lessons) {
      const filtered = lessons.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedPentateuch === 'all' ||
            lesson.pentateuch === selectedPentateuch)
      );
      setFilteredLessons(filtered);
    }
  }, [lessons, searchTerm, selectedPentateuch]);

  const handleNavigate = () => {
    navigate('/upload-lesson');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteLesson = (lessonId: string) => {
    deleteLesson(lessonId, {
      onSuccess: () => {
        setToaster({
          open: true,
          message: 'ההמלצות עודכנו בהצלחה',
          color: 'success',
        });
      },
      onError: () => {
        setToaster({
          open: true,
          message: 'קרתה תקלה בעת עדכון ההמלצות, אנא נסה שנית',
          color: 'error',
        });
      },
    });
  };

  const renderStudentCard = (lesson: LessonDetails) => {
    const cardStyle: React.CSSProperties = {
      position: 'relative',
      animation: isEditing
        ? 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite'
        : 'none',
    };

    return (
      <div style={cardStyle}>
        {isEditing && (
          <div
            style={{
              position: 'absolute',
              top: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLesson(lesson.id!);
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              X
            </div>
          </div>
        )}
        <LessonCard
          lessonDetails={lesson}
          onClick={() => {
            if (!isEditing) {
              navigate(`/teacher-personal-area/lesson/${lesson.id}`, {
                state: { lessonDetails: lesson },
              });
            }
          }}
        />
      </div>
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handlePentateuchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPentateuch(event.target.value);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      <style>
        {`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        `}
      </style>

      <Typography variant="h1" gutterBottom>
        השיעורים שלי
      </Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <TextField
          label="חיפוש שיעור לפי כותרת"
          sx={{ textAlign: 'right', direction: 'rtl' }}
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: '100%', maxWidth: '400px' }}
        />
        <IconButton onClick={handleFilterOpen} aria-label="filter">
          <FilterListIcon />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditToggle}
          style={{ marginLeft: '10px' }}
        >
          {isEditing ? 'סיום עריכה' : 'עריכה'}
        </Button>
      </div>

      {filteredLessons ? (
        <DisplayCards
          items={filteredLessons}
          renderCard={renderStudentCard}
          viewMode={viewMode}
          isLoading={isLoading}
          noItemsMessage={'אין לך שיעורים כרגע'}
          xs={12}
          sm={6}
          md={4}
        />
      ) : (
        <p style={{ textAlign: 'center' }}>
          {isLoading ? (
            <Loader message="טוען שיעורים" />
          ) : (
            'אין לך שיעורים כרגע'
          )}
        </p>
      )}

      <FloatingActionButton
        onClick={handleNavigate}
        icon={<UploadFileIcon />}
        ariaLabel="add lesson"
      />

      <DialogComponent
        open={filterOpen}
        title="סנן לפי חומש"
        onClose={handleFilterClose}
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="pentateuch"
            name="pentateuch"
            value={selectedPentateuch}
            onChange={handlePentateuchChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="הכל" />
            <FormControlLabel
              value="בראשית"
              control={<Radio />}
              label="בראשית"
            />
            <FormControlLabel value="שמות" control={<Radio />} label="שמות" />
            <FormControlLabel value="ויקרא" control={<Radio />} label="ויקרא" />
            <FormControlLabel value="במדבר" control={<Radio />} label="במדבר" />
            <FormControlLabel value="דברים" control={<Radio />} label="דברים" />
          </RadioGroup>
        </FormControl>
      </DialogComponent>
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </div>
  );
};

export default withFade(TeacherPersonalArea);
