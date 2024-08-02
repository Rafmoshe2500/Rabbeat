import React, { useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import DialogComponent from "../common/dialog";
import RTLDatePicker from "../common/rtl-inputs/rtl-date-picker";
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "$isExpired" && prop !== "$viewMode",
})<{ $isExpired: boolean; $viewMode: "grid" | "list" }>(({ theme, $isExpired, $viewMode }) => ({
  width: $viewMode === "grid" ? 280 : "100%",
  height: $viewMode === "grid" ? 200 : "auto",
  margin: $viewMode === "grid" ? "1rem" : "0.5rem 0",
  position: "relative",
  border: `2px solid ${$isExpired ? theme.palette.grey[400] : theme.palette.success.main}`,
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
  },
}));

const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
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

  const handleClick = () => {
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
      <StyledCard $isExpired={isExpired} $viewMode={viewMode} onContextMenu={handleContextMenu}>
        <CardActionArea onClick={handleClick} sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%' }}>
            <ContentWrapper>
              <InfoRow>
                <Typography variant="h6" component="div" noWrap>
                  {`${student.firstName} ${student.lastName}`}
                </Typography>
                {student.updated && (
                  <Tooltip title="קיים עדכון" arrow>
                    <Badge color="primary" variant="dot">
                      <NotificationsActiveIcon sx={{ color: 'text.secondary' }} />
                    </Badge>
                  </Tooltip>
                )}
              </InfoRow>
              <InfoRow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" noWrap>{student.phoneNumber}</Typography>
                </Box>
                <Chip
                  label={isExpired ? "לא פעיל" : "פעיל"}
                  size="small"
                  color={isExpired ? "default" : "success"}
                />
              </InfoRow>
              <InfoRow sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: isExpired ? 'error.main' : 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {isExpired ? "הסתיים" : `${daysLeft} ימים לסיום`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(student.expired_date)}
                  </Typography>
                </Box>
              </InfoRow>
            </ContentWrapper>
          </CardContent>
        </CardActionArea>
      </StyledCard>
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => { setOpenDatePicker(true); handleCloseMenu(); }}>
          עדכן תאריך סיום
        </MenuItem>
      </Menu>
      
      <DialogComponent 
        open={openDatePicker}
        title="עדכן תאריך סיום"
        onClose={handleCloseDatePicker}
        onConfirm={handleConfirmUpdateDate}
      >
        <RTLDatePicker
          label="תאריך סיום חדש"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </DialogComponent>
    </>
  );
};

export default StudentCard;