import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Add as AddIcon, Comment as CommentIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-inputs/rtl-text-field';
import { useTheme } from '@mui/material/styles';
import { useGetConnection, useUpdateProfile } from '../../hooks/useProfile';

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
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');
  const theme = useTheme();
  const userConnection = useGetConnection(currentUserId, teacherId)
  const updateProfileMutation = useUpdateProfile();
  const [localRecommendations, setLocalRecommendations] = useState<Recommendation[]>(recommendations);

  useEffect(() => {
    setLocalRecommendations(recommendations);
  }, [recommendations]);

  const handleRecommendationsUpdate = (updatedRecommendations: Recommendation[]) => {
    const updateData: updateProfile = {
      id: teacherId,
      key: 'recommendations',
      value: updatedRecommendations
    };
    updateProfileMutation.mutate(updateData, {
      onSuccess: () => {
        setLocalRecommendations(updatedRecommendations);
      }
    });
  };
  
  const handleAddRecommendation = () => {
    if (newRecommendation && currentUserId) {
      const updatedRecommendations = [...localRecommendations, { text: newRecommendation, studentId: currentUserId }];
      handleRecommendationsUpdate(updatedRecommendations);
      setNewRecommendation('');
    }
  };

  const handleDeleteRecommendation = (studentId: string) => {
    const updatedRecommendations = localRecommendations.filter(rec => rec.studentId !== studentId);
    handleRecommendationsUpdate(updatedRecommendations);
  };

  return (
    <Box sx={{ marginTop: theme.spacing(2.5), display: 'flex', justifyContent: 'center' }}>
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
        onConfirm={() => setRecommendationsDialogOpen(false)}
      >
        <Box sx={{ marginTop: theme.spacing(2.5), width: '100%' }}>
          <List>
            {localRecommendations.map((recommendation, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{textAlign: 'right'}}>
                  <ListItemText primary={recommendation.text} />
                  {currentUserId === recommendation.studentId && (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteRecommendation(recommendation.studentId)}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: theme.spacing(2) }}>
              <RTLTextField dir='rtl'
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
    </Box>
  );
};

export default ProfileRecommendations;