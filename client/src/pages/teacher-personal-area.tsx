import React, { useState, useEffect } from "react";
import { useLessonsDetailsByUser } from "../hooks/lessons/useLessonsDetailsByUser";
import { useUser } from "../contexts/user-context";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/loader";
import DisplayCards from "../components/common/display-cards/display-cards";
import { useMediaQuery, TextField, Radio, RadioGroup, FormControlLabel, FormControl, IconButton } from "@mui/material";
import LessonCard from "../components/lessons/lesson-card/lesson-card";
import withFade from "../hoc/withFade.hoc";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FilterListIcon from "@mui/icons-material/FilterList";
import FloatingActionButton from '../components/common/floating-action-button';
import DialogComponent from '../components/common/dialog';

const TeacherPersonalArea = () => {
  const { userDetails } = useUser();
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useLessonsDetailsByUser(userDetails!.id);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const viewMode = isSmallScreen ? "list" : "grid";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPentateuch, setSelectedPentateuch] = useState("all");
  const [filteredLessons, setFilteredLessons] = useState(lessons);

  useEffect(() => {
    if (lessons) {
      const filtered = lessons.filter((lesson) => 
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedPentateuch === "all" || lesson.pentateuch === selectedPentateuch)
      );
      setFilteredLessons(filtered);
    }
  }, [lessons, searchTerm, selectedPentateuch]);

  const handleNavigate = () => {
    navigate("/upload-lesson");
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

  const handlePentateuchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPentateuch(event.target.value);
  };

  const handleFilterConfirm = () => {
    handleFilterClose();
  };

  const renderStudentCard = (lesson: LessonDetails) => (
    <LessonCard lessonDetails={lesson} />
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>אזור אישי למורה</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <TextField
          label="חיפוש שיעור לפי כותרת"
          sx={{textAlign: 'right', direction: 'rtl'}}
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: "100%", maxWidth: "400px" }}
        />
        <IconButton onClick={handleFilterOpen} aria-label="filter">
          <FilterListIcon />
        </IconButton>
      </div>

      {filteredLessons ? (
        <DisplayCards
          items={filteredLessons}
          renderCard={renderStudentCard}
          viewMode={viewMode}
          isLoading={isLoading}
          noItemsMessage={"אין לך שיעורים כרגע"}
          xs={12}
          sm={6}
          md={4}
        />
      ) : (
        <p style={{ textAlign: "center" }}>
          {isLoading ? (
            <Loader message="טוען שיעורים" />
          ) : (
            "אין לך שיעורים כרגע"
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
        onConfirm={handleFilterConfirm}
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="pentateuch"
            name="pentateuch"
            value={selectedPentateuch}
            onChange={handlePentateuchChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="הכל" />
            <FormControlLabel value="בראשית" control={<Radio />} label="בראשית" />
            <FormControlLabel value="שמות" control={<Radio />} label="שמות" />
            <FormControlLabel value="ויקרא" control={<Radio />} label="ויקרא" />
            <FormControlLabel value="במדבר" control={<Radio />} label="במדבר" />
            <FormControlLabel value="דברים" control={<Radio />} label="דברים" />
          </RadioGroup>
        </FormControl>
      </DialogComponent>
    </div>
  );
};

export default withFade(TeacherPersonalArea);