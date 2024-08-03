import { useLocation, useNavigate } from "react-router-dom";
import "./lesson-card.css";
import { useUser } from "../../../contexts/user-context";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Badge,
  Tooltip,
  Modal,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import CloseIcon from "@mui/icons-material/Close";
import { lessonStatusMapper, lessonVersionsMapper } from "../../../utils/utils";

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
    version,
  } = lessonDetails;

  const [modalOpen, setModalOpen] = useState(false);

  const onClick = () => {
    let route = "";
    if (userDetails?.type === "student") {
      route = `/lesson/${id}`;
    } else {
      route = `${location.pathname}/lessons/${id}`;
    }

    navigate(route, { state: { id, lessonDetails, studentId } });
  };

  const getTooltipTitle = () => {
    if (status === "finished") {
      return "בוצע";
    }

    if (!audioNotification && !messageNotifications) {
      return "אין עדכון זמין";
    }

    const messageText = messageNotifications ? "קיימים הודעות חדשות" : "";
    const audioText = audioNotification
      ? userDetails?.type === "student"
        ? "מחכה לבדיקת המורה"
        : "אודיו חדש לבדיקה"
      : "";

    return [audioText, messageText].filter(Boolean).join("<br />");
  };

  const getBorderColor = () => {
    switch (status) {
      case "not-started":
        return "#9E9E9E";
      case "in-progress":
        return "#FFB74D";
      case "finished":
        return "#4CAF50";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "not-started":
        return "default";
      case "in-progress":
        return "warning";
      case "finished":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ minWidth: 275, maxWidth: 345, margin: "1rem" }}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          border: `1px solid ${getBorderColor()}`,
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {messageNotifications && (
                  <Tooltip title="קיימות הודעות חדשות" arrow>
                    <Badge color="primary" variant="dot">
                      <ChatIcon />
                    </Badge>
                  </Tooltip>
                )}
                {audioNotification && (
                  <Tooltip
                    title={
                      userDetails?.type === "student"
                        ? "מחכה לבדיקת המורה"
                        : "אודיו חדש לבדיקה"
                    }
                    arrow
                  >
                    <Badge color="primary" variant="dot">
                      <AudioFileIcon />
                    </Badge>
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pentateuch}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`${startChapter}:${startVerse} - ${endChapter}:${endVerse}`}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Chip
                label={
                  status === "finished" ? "הסתיים" : lessonStatusMapper[status!]
                }
                size="small"
                color={getStatusColor()}
              />
              <Typography variant="caption" color="text.secondary">
                {`סגנון קריאה: ${lessonVersionsMapper[version!]}`}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: 300,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => setModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Notification Details
          </Typography>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: getTooltipTitle() }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default LessonCard;
