import { useLocation, useNavigate } from "react-router-dom";
import "./lesson-card.css";
import { useUser } from "../../../contexts/user-context";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";
import { lessonStatusMapper } from "../../../utils/utils";
import LED from "../../common/led";

type LessonCardProps = {
  lessonDetails: Partial<LessonDetails>;
  studentId?: string;
};

const LessonCard = ({ lessonDetails, studentId }: LessonCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useUser();
  const { 
    id, 
    status, 
    title, 
    messageNotifications, 
    audioNotification,
    startChapter, 
    startVerse, 
    endChapter, 
    endVerse, 
    pentateuch, 
    version 
  } = lessonDetails;
  console.log(lessonDetails)
  const onClick = () => {
    let route = "";
    if (userDetails?.type === "student") {
      route = `/lesson/${id}`;
    } else {
      route = `${location.pathname}/lessons/${id}`;
    }

    navigate(route, { state: { id, lessonDetails, studentId } });
  };

  const getBorderColor = () => {
    switch (status) {
      case "not-started":
        return "#E0E0E0"; // Light gray
      case "in-progress":
        return "#FFD700"; // Gold
      case "finished":
        return "#4CAF50"; // Green
      default:
        return "#E0E0E0";
    }
  };
  const isStudent = userDetails?.type === "student";

  const getTooltipTitle = () => {
    if (status === "finished") {
      return 'בוצע';
    }

    if (!audioNotification && !messageNotifications) {
      return 'אין עדכון זמין';
    }

    const messageText = messageNotifications ? 'קיימים הודעות חדשות' : '';
    const audioText = audioNotification
      ? isStudent
        ? 'מחכה לבדיקת המרצה'
        : 'קיים נסיון חדש לבדיקה'
      : '';

    return [audioText, messageText].filter(Boolean).join('<br />');
  };
  return (
    <Box sx={{ minWidth: 275, maxWidth: 345, margin: "1rem" }}>
      <Card 
        variant="outlined"
        sx={{
          position: "relative",
          border: `2px solid ${getBorderColor()}`,
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardActionArea onClick={onClick}>

        <Tooltip sx={{textAlign: 'right'}} title={<div dangerouslySetInnerHTML={{ __html: getTooltipTitle() }} />}>
            <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>

              <LED status={status === 'finished' ? 'off' : audioNotification ? "half" : "ok"} />
            </Box>
          </Tooltip>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pentateuch}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`${startChapter}:${startVerse} - ${endChapter}:${endVerse}`}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
              <Chip 
                label={lessonStatusMapper[status!]} 
                size="small"
                sx={{ 
                  backgroundColor: getBorderColor(),
                  color: status === "not-started" ? "black" : "white",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {`Version: ${version}`}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default LessonCard;