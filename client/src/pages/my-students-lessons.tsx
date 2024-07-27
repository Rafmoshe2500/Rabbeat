import { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useMediaQuery} from "@mui/material";
import { useUser } from "../contexts/user-context";
import { useStudentLessonsByTeacher } from "../hooks/lessons/useStudentLessonsByTeacher";
import { useAssociateLesson, useDisassociateLesson } from "../hooks/useAssociateLesson";
import Loader from "../components/common/loader";
import DisplayCards from "../components/common/display-cards/display-cards";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import DialogComponent from "../components/common/dialog";
import withFade from "../hoc/withFade.hoc";
import { useLessonsDetailsByUser } from '../hooks/lessons/useLessonsDetailsByUser';
import FloatingActionButton from '../components/common/floating-action-button'
import DialogContent from '../components/teacher-lessons/dialog-content'
import AddIcon from '@mui/icons-material/Add';

const MyStudentLessons = () => {
  const location = useLocation();
  const studentId: string = location.state?.id;
  const { userDetails } = useUser();

  const { data: studentLessons, isLoading: isStudentLessonsLoading } = useStudentLessonsByTeacher(
    userDetails!.id,
    studentId
  );

  const { data: teacherLessons, isLoading: isTeacherLessonsLoading } = useLessonsDetailsByUser(userDetails!.id);

  const associateLessonMutation = useAssociateLesson(studentId, userDetails!.id);
  const disassociateLessonMutation = useDisassociateLesson(studentId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleLessonClick = (lessonId: string, isAssociated: boolean) => {
    if (!isAssociated) {
      setSelectedLessonId(lessonId);
      associateLessonMutation.mutate(lessonId);
      closeDialog();
    }
  };

  const handleDisassociate = (lessonId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את פתיחת השיעור הזה?')) {
      disassociateLessonMutation.mutate(lessonId);
    }
  };

  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} />
  );

  const filteredLessons = Array.isArray(teacherLessons) 
    ? teacherLessons.filter(lesson => lesson.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div>
      <div style={{ marginBottom: "8rem" }}>תלמיד חכם</div>

      {studentLessons ? (
        <DisplayCards
          items={studentLessons}
          renderCard={renderStudentCard}
          viewMode={viewMode}
          xs={12}
          sm={6}
          md={3}
        />
      ) : (
        isStudentLessonsLoading ? (
          <Loader message="טוען שיעורים" />
        ) : (
          <div>אין לך שיעורים כרגע</div>
        )
      )}

      <FloatingActionButton 
        onClick={openDialog}
        icon={<AddIcon />} />

      <DialogComponent
        open={isDialogOpen}
        title="הקצאת שיעור"
        onClose={closeDialog}
        onConfirm={() => {
          if (selectedLessonId) {
            associateLessonMutation.mutate(selectedLessonId);
          }
          closeDialog();
        }}
      >
        <DialogContent
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          isLoading={isTeacherLessonsLoading}
          filteredLessons={filteredLessons}
          studentLessons={studentLessons}
          onLessonClick={handleLessonClick}
          onDisassociate={handleDisassociate}
        />
      </DialogComponent>
    </div>
  );
};

export default withFade(MyStudentLessons);