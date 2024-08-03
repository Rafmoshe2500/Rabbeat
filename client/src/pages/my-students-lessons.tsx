import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useUser } from "../contexts/user-context";
import { useStudentLessonsByTeacher } from "../hooks/lessons/useStudentLessonsByTeacher";
import {
  useAssociateLesson,
  useDisassociateLesson,
} from "../hooks/useAssociateLesson";
import DisplayCards from "../components/common/display-cards/display-cards";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import DialogComponent from "../components/common/dialog";
import withFade from "../hoc/withFade.hoc";
import { useLessonsDetailsByUser } from "../hooks/lessons/useLessonsDetailsByUser";
import FloatingActionButton from "../components/common/floating-action-button";
import DialogContent from "../components/teacher-lessons/dialog-content";
import AddIcon from "@mui/icons-material/Add";
import { useGetStudents } from "../hooks/useStudents";
import StudentCard from "../components/students-dashboard/student-card";

const MyStudentLessons: React.FC = () => {
  const { userDetails } = useUser();
  const location = useLocation();
  const studentId: string = location.state?.id;
  const { data: fetchedStudents = [] } = useGetStudents(userDetails!.id);
  const studentDetails = useMemo(
    () => fetchedStudents.find((student) => student.id === studentId),
    [fetchedStudents]
  );

  const {
    data: studentLessons,
    isLoading: isStudentLessonsLoading,
    refetch: refetchStudentLessons,
  } = useStudentLessonsByTeacher(userDetails!.id, studentId);

  const { data: teacherLessons, isLoading: isTeacherLessonsLoading } =
    useLessonsDetailsByUser(userDetails!.id);

  const associateLessonMutation = useAssociateLesson(
    studentId,
    userDetails!.id
  );
  const disassociateLessonMutation = useDisassociateLesson(studentId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleLessonClick = async (lessonId: string, isAssociated: boolean) => {
    if (!isAssociated) {
      console.log(selectedLessonId);
      setSelectedLessonId(lessonId);

      try {
        await associateLessonMutation.mutateAsync(lessonId);
        await refetchStudentLessons();
      } catch (error) {
        console.error("Failed to associate lesson:", error);
      }
    }
  };

  const handleDisassociate = async (lessonId: string) => {
    if (window.confirm("האם אתה בטוח שברצונך לבטל את פתיחת השיעור הזה?")) {
      try {
        await disassociateLessonMutation.mutateAsync(lessonId);
        await refetchStudentLessons();
      } catch (error) {
        console.error("Failed to disassociate lesson:", error);
      }
    }
  };

  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} studentId={studentId} />
  );

  const filteredLessons = Array.isArray(teacherLessons)
    ? teacherLessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div>
      <div
        style={{
          marginBottom: "8rem",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          placeContent: "center",
        }}
      >
        <h1> {`${studentDetails?.firstName} ${studentDetails?.lastName}`}</h1>
      </div>

      <DisplayCards
        items={studentLessons || []}
        renderCard={renderStudentCard}
        viewMode={viewMode}
        isLoading={isStudentLessonsLoading}
        noItemsMessage={"טרם הוספת שיעורים לתלמיד זה"}
        xs={12}
        sm={6}
        md={3}
      />

      <FloatingActionButton
        onClick={openDialog}
        icon={<AddIcon />}
        ariaLabel="add lesson"
      />

      <DialogComponent
        open={isDialogOpen}
        title="פתיחת שיעור לתלמיד"
        onClose={closeDialog}
        onConfirm={closeDialog}
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
