import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertBlobToBase64 } from "../utils/audio-parser";
import BibleSelector from "../components/bible-selector/bible-selector";
import { useCreateOrUpdateLesson } from "../hooks/useCreateOrUpdateLesson";
import AudioRecorder from "../components/audio-recorder/audio-recorder";
import { useUser } from "../contexts/user-context";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  ToggleButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { styled } from "@mui/material/styles";
import withFade from "../hoc/withFade.hoc";
import { lessonVersionsMapper } from "../utils/utils";
import BibleParashotSelector from "../components/bible-selector/aliot-selector";
import useToaster from "../hooks/useToaster";
import Toaster from "../components/common/toaster";
import Loader from "../components/common/loader";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.light,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.dark,
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "50%",
  minWidth: "auto",
  width: 64,
  height: 64,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
  },
}));

const UploadLessonPage: React.FC = () => {
  const { userDetails } = useUser();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [timestamps, setTimestamps] = useState<number[]>([0.0]);
  const [bibleSelectorMode, setBibleSelectorMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { mutate } = useCreateOrUpdateLesson(userDetails?.id!);
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  const [lesson, setLesson] = useState({
    title: "",
    version: "Spanish",
    creationDate: "",
    audio: "",
    highlightsTimestamps: [],
  });

  const [torahSection, setTorahSection] = useState({
    startChapter: "",
    startVerse: "",
    endChapter: "",
    endVerse: "",
    pentateuch: "",
  });

  const handleRecordingComplete = (
    audioBlob: Blob,
    transcript: string,
    timestamps: number[]
  ) => {
    setAudioBlob(audioBlob);
    setTranscript(transcript);
    setTimestamps(timestamps);
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>
  ) => {
    const { name, value } = e.target;
    setLesson((prevLesson) => ({
      ...prevLesson,
      [name]: value,
    }));
  };

  const setTitle = (newTitle: string) => {
    setLesson((prevLesson) => ({
      ...prevLesson,
      title: newTitle,
    }));
  };

  const handleBibleSelector = (
    event: React.MouseEvent<HTMLElement>,
    newMode: boolean
  ) => {
    event;
    setTitle("");
    setBibleSelectorMode(!newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const lessonToUpload = {
      ...lesson,
      ...torahSection,
      creationDate: new Date().toISOString(),
      audio: await convertBlobToBase64(audioBlob!),
      highlightsTimestamps: timestamps,
      sttText: transcript,
    } as FormattedLesson;

    mutate(lessonToUpload, {
      onSuccess: async (data) => {
        setLoading(false);
        if (data) {
          setToaster({
            open: true,
            message: "השיעור עלה בהצלחה.",
            color: "success",
          });
          navigate(`/teacher-personal-area/lesson/${data}`, {
            state: { lessonDetails: { title: lesson.title, ...torahSection } },
          });
        } else {
          console.error("Lesson ID not received in the response");
        }
      },
      onError: (error) => {
        setLoading(false);
        console.error("Error creating lesson:", error);
        setToaster({
          open: true,
          message: "קיימת בעיה בהעלאת השיעור.",
          color: "error",
        });
      },
    });
  };

  const isFormComplete = (): boolean => {
    return (
      ((bibleSelectorMode && !!lesson.title) || !bibleSelectorMode) &&
      !!torahSection.endVerse &&
      !!lesson.version &&
      audioBlob !== null &&
      timestamps.length > 1
    );
  };

  if (loading)
    return <Loader message="מעלה את האודיו, זה עלול לקחת מספר רגעים" />;

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        העלאת שיעור חדש
      </Typography>

      {isFormComplete() && (
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <UploadButton
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            <UploadFileIcon fontSize="large" />
          </UploadButton>
        </Box>
      )}
      <StyledPaper elevation={0}>
        <Box component="form" noValidate sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={4}>
            {bibleSelectorMode && (
              <Grid item xs={12}>
                <StyledTextField
                  style={{ direction: "rtl" }}
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="כותרת"
                  value={lesson.title}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="version-label">נוסח</InputLabel>
                <StyledSelect
                  labelId="version-label"
                  id="version"
                  name="version"
                  value={lesson.version}
                  onChange={handleChange}
                  label="נוסח"
                >
                  {Object.entries(lessonVersionsMapper).map(([key, value]) => (
                    <MenuItem sx={{ direction: "rtl" }} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <div>
          <ToggleButton
            onClick={handleBibleSelector}
            sx={{ outline: "none !important" }}
            value={bibleSelectorMode}
            selected={bibleSelectorMode}
          >
            {bibleSelectorMode ? "בחר עליה" : "התאמה אישית"}
          </ToggleButton>
        </div>

        {!bibleSelectorMode ? (
          <BibleParashotSelector
            setTorahSection={setTorahSection}
            setLessonTitle={setTitle}
          />
        ) : (
          <BibleSelector setTorahSection={setTorahSection} />
        )}
        <Box sx={{ mt: 4 }}>
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            shouldCalculateHighlights
            shouldDisplayTranscript
          />
        </Box>
      </StyledPaper>
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </Container>
  );
};

export default withFade(UploadLessonPage);
