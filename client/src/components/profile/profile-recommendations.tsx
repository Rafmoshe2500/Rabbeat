import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Comment as CommentIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import DialogComponent from "../common/dialog";
import { useTheme } from "@mui/material/styles";
import { useGetConnection, useUpdateProfile } from "../../hooks/useProfile";
import useToaster from "../../hooks/useToaster";
import Toaster from "../common/toaster";

type Recommendation = {
  text: string;
  studentId: string;
};

type ProfileRecommendationsProps = {
  recommendations: Recommendation[];
  teacherId: string;
  currentUserId?: string;
};

const ProfileRecommendations: React.FC<ProfileRecommendationsProps> = ({
  recommendations,
  teacherId,
  currentUserId,
}) => {
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] =
    useState(false);
  const [newRecommendation, setNewRecommendation] = useState("");
  const theme = useTheme();
  const userConnection = useGetConnection(currentUserId, teacherId);
  const updateProfileMutation = useUpdateProfile();
  const [localRecommendations, setLocalRecommendations] =
    useState<Recommendation[]>(recommendations);
  const { toaster, setToaster, handleCloseToaster } = useToaster();

  useEffect(() => {
    setLocalRecommendations(recommendations);
  }, [recommendations]);

  const handleRecommendationsUpdate = (
    updatedRecommendations: Recommendation[]
  ) => {
    const updateData: updateProfile = {
      id: teacherId,
      key: "recommendations",
      value: updatedRecommendations,
    };
    updateProfileMutation.mutate(updateData, {
      onSuccess: () => {
        setLocalRecommendations(updatedRecommendations);
        setToaster({
          open: true,
          message: "ההמלצות עודכנו בהצלחה",
          color: "success",
        });
      },
      onError: () => {
        setToaster({
          open: true,
          message: "קרתה תקלה בעת עדכון ההמלצות, אנא נסה שנית",
          color: "error",
        });
      },
    });
  };

  const handleAddRecommendation = () => {
    if (newRecommendation && currentUserId) {
      const updatedRecommendations = [
        ...localRecommendations,
        { text: newRecommendation, studentId: currentUserId },
      ];
      handleRecommendationsUpdate(updatedRecommendations);
      setNewRecommendation("");
    }
  };

  const handleDeleteRecommendation = (studentId: string) => {
    const updatedRecommendations = localRecommendations.filter(
      (rec) => rec.studentId !== studentId
    );
    handleRecommendationsUpdate(updatedRecommendations);
  };

  return (
    <Box
      sx={{
        marginTop: theme.spacing(2.5),
        display: "flex",
        justifyContent: "center",
      }}
    >
      <IconButton
        onClick={() => setRecommendationsDialogOpen(true)}
        sx={{ color: theme.palette.text.primary }}
      >
        <CommentIcon />
        <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
          {localRecommendations.length} המלצות
        </Typography>
      </IconButton>
      <DialogComponent
        open={recommendationsDialogOpen}
        title="תגובות סטודנטים"
        onClose={() => setRecommendationsDialogOpen(false)}
      >
        <Box sx={{ marginTop: theme.spacing(2.5), width: "100%" }}>
          <List>
            {localRecommendations.map((recommendation, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ textAlign: "right" }}>
                  <ListItemText primary={recommendation.text} />
                  {currentUserId === recommendation.studentId && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() =>
                          handleDeleteRecommendation(recommendation.studentId)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {index < localRecommendations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          {userConnection.data && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: theme.spacing(2),
              }}
            >
              <TextField
                dir="rtl"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="הוסף תגובה חדשה"
                sx={{ flexGrow: 1, marginRight: theme.spacing(1.25) }}
              />
              <IconButton
                color="primary"
                onClick={handleAddRecommendation}
                sx={{ padding: theme.spacing(1) }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogComponent>
      <Toaster
        message={toaster.message}
        open={toaster.open}
        color={toaster.color}
        onClose={handleCloseToaster}
      />
    </Box>
  );
};

export default ProfileRecommendations;
