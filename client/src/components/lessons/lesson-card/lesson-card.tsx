import { useNavigate } from "react-router-dom";
import "./lesson-card.css";
import { useUser } from "../../../contexts/user-context";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

type LessonCardProps = {
  lessonDetails: Partial<LessonDetailsWIthStatus>;
};

const LessonCard = ({ lessonDetails }: LessonCardProps) => {
  const navigate = useNavigate();
  const { userDetails } = useUser();
  const { id, status, title } = lessonDetails;

  const onClick = () => {
    const route =
      userDetails?.type === "student" ? `/lesson/${id}` : "/upload-lesson";

    navigate(route, { state: { id, lessonDetails } });
  };

  return (
    <Box
      sx={{
        minWidth: 225,
        margin: "1rem 2rem 1rem 2rem",
      }}
    >
      <Card variant="outlined">
        <CardActionArea onClick={onClick}>
          <CardContent className={status}>
            <Typography variant="h5" component="div" gutterBottom>
              {title}
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              {status}
            </Typography>
            {/* {// TODO: add all lesson details - name, type, status etc} */}
            {/* <Typography variant="h5" component="div">
          benevolent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default LessonCard;
