import React, { useState } from "react";
import { Paper, Typography, Menu, MenuItem, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import RTLDatePicker from "../common/rtl-inputs/rtl-date-picker";
import dayjs from 'dayjs';
import DialogComponent from "../common/dialog";
import LED from '../common/led';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$viewMode" && prop !== "$isExpired",
})<{ $viewMode: "grid" | "list"; $isExpired: boolean }>(({ theme, $isExpired, $viewMode }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(1),
  textAlign: "center",
  color: $isExpired ? theme.palette.text.secondary : theme.palette.text.primary,
  width: '100%',
  maxWidth: $viewMode === "grid" ? "350px" : "100%",
  height: $viewMode === "grid" ? "100%" : "auto",
  display: "flex",
  flexDirection: $viewMode === "grid" ? "column" : "row",
  justifyContent: "space-between",
  alignItems: $viewMode === "grid" ? "center" : "flex-start",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "all 0.3s",
  background: $isExpired
    ? theme.palette.action.disabledBackground
    : theme.palette.background.paper,
  boxShadow: $isExpired
    ? 'inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.5)'
    : '5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.5)',
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: $isExpired
      ? 'inset 7px 7px 14px rgba(0, 0, 0, 0.1), inset -7px -7px 14px rgba(255, 255, 255, 0.5)'
      : '7px 7px 14px rgba(0, 0, 0, 0.1), -7px -7px 14px rgba(255, 255, 255, 0.5)',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
}));

const InfoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    alignItems: 'center',
  },
}));

const InfoItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
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
    setOpenDatePicker(false);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setSelectedDate(newDate);
  };

  const handleConfirmUpdateDate = () => {
    if (selectedDate) {
      onUpdateExpiredDate(student.id, selectedDate.toISOString());
    }
    setOpenDatePicker(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

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
        elevation={0}
        $viewMode={viewMode}
        $isExpired={isExpired}
      >
        <Tooltip title={isExpired ? 'לא בשימוש' : (student.updated ? 'קיים עדכון' : 'אין עדכונים')}>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <LED status={isExpired ? 'off' : (student.updated ? 'half' : 'ok')} />
          </div>
        </Tooltip>        
        <Typography variant="h4" gutterBottom>
          {`${student.firstName} ${student.lastName}`}
        </Typography>
        
        <InfoContainer>
          <InfoItem>
            <PhoneIcon fontSize="medium" color="primary" />
            <Typography variant="body1">{student.phoneNumber}</Typography>
          </InfoItem>
          <InfoItem>
            <AccessTimeIcon fontSize="medium" color={isExpired ? "error" : "primary"} />
            <Typography variant="body1" color={isExpired ? "error" : "#616161"}>
              {isExpired 
                ? "הסתיים" 
                : `${daysLeft} ימים לסיום`}
            </Typography>
          </InfoItem>
          <InfoItem>
            <EventIcon fontSize="medium" color="primary" />
            <Typography variant="body1">
              {formatDate(student.expired_date)}
            </Typography>
          </InfoItem>
        </InfoContainer>
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
        onClose={handleCloseDatePicker}
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
