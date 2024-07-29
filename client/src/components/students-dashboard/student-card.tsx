import React, { useState } from "react";
import { Paper, Typography, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import RTLDatePicker from "../common/rtl-inputs/rtl-date-picker";
import dayjs from 'dayjs';
import DialogComponent from "../common/dialog";
import LED from '../common/led'

type StyledPaperProps = {
  $viewMode: "grid" | "list";
  $isExpired: boolean;
};

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$viewMode" && prop !== "$isExpired",
})<StyledPaperProps>(({ $isExpired }) => ({
  padding: "16px",
  textAlign: "center",
  color: "#666666",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 16,
  transition: "all 0.3s",
  border: `2px solid ${$isExpired ? "#808080" : "#4CAF50"}`,
  position: "relative", // Add this line
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

interface StudentCardProps {
  student: Student;
  viewMode: "grid" | "list";
  onUpdateExpiredDate: (studentId: string, newExpiredDate: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, viewMode, onUpdateExpiredDate }) => {
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs(student.expired_date));

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const route = `/my-students/${student.firstName}-${student.lastName}`;
    navigate(route, { state: { id: student.id } });
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null,
    );
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

const handleCloseDatePicker = () => {
  setOpenDatePicker(false)

}

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDate(newDate);
  };

  const handleConfirmUpdateDate = () => {
    if (selectedDate) {
      onUpdateExpiredDate(student.id, selectedDate.toISOString());
    }
    setOpenDatePicker(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const LEDContainer = styled('div')({
    position: 'absolute',
    top: '10px',
    left: '10px',
  });

  const calculateDaysLeft = (expiredDate: string) => {
    const today = new Date();
    const expirationDate = new Date(expiredDate);
    const timeDiff = expirationDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const isExpired = new Date(student.expired_date) < new Date();
  const daysLeft = calculateDaysLeft(student.expired_date);

  return (
    <>
      <StyledPaper
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        elevation={viewMode === "grid" ? 3 : 0}
        $viewMode={viewMode}
        $isExpired={isExpired}
      >
        <LEDContainer>
          <LED status={!isExpired ? student.updated ? 'half' : 'ok' : 'off'} />
        </LEDContainer>
        <Typography variant={viewMode === "grid" ? "h5" : "body1"} gutterBottom>
          {`${student.firstName} ${student.lastName}`}
        </Typography>
        <Typography variant={viewMode === "grid" ? "h6" : "body2"}>
          {student.phoneNumber}
        </Typography>
        <Typography variant={viewMode === "grid" ? "body1" : "body2"}>
          {isExpired 
            ? "ימים לסיום: הסתיים" 
            : `ימים לסיום: ${daysLeft}`}
        </Typography>
        <Typography variant={viewMode === "grid" ? "body1" : "body2"}>
          {formatDate(student.expired_date)}
        </Typography>
        </StyledPaper>
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        dir="rtl"
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => setOpenDatePicker(true)}>עדכן תאריך סיום.</MenuItem>
      </Menu>
      
      
      <DialogComponent 
        open={openDatePicker}
        title="עדכן תאריך."
        onClose={() => handleCloseDatePicker}
        onConfirm={handleConfirmUpdateDate}
      >
        <RTLDatePicker
          label="תאריך סיום חדש"
          value={dayjs(student.expired_date)}
          onChange={handleDateChange}
        />
      </DialogComponent>
    </>
  );
};

export default StudentCard;