import React, { useState } from 'react';
import { Box, Typography, IconButton, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Add as AddIcon, Comment as CommentIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field';
import { useTheme } from '@mui/material/styles';

type Recommendation = {
  text: string;
  studentId: string;
};

type ProfileRecommendationsProps = {
  recommendations: Recommendation[];
  canAddComment: boolean;
  currentUserId?: string;
  onUpdate: (key: 'recommendations', value: Recommendation[]) => void;
};

const ProfileRecommendations: React.FC<ProfileRecommendationsProps> = ({ 
  recommendations, 
  canAddComment, 
  currentUserId, 
  onUpdate 
}) => {
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');
  const theme = useTheme();

  const handleAddRecommendation = () => {
    if (newRecommendation && currentUserId) {
      const updatedRecommendations = [...recommendations, { text: newRecommendation, studentId: currentUserId }];
      onUpdate('recommendations', updatedRecommendations);
      setNewRecommendation('');
    }
  };

  const handleDeleteRecommendation = (studentId: string) => {
    const updatedRecommendations = recommendations.filter(rec => rec.studentId !== studentId);
    onUpdate('recommendations', updatedRecommendations);
  };

  return (
    <Box sx={{ marginTop: theme.spacing(2.5), display: 'flex', justifyContent: 'center' }}>
      <IconButton 
        onClick={() => setRecommendationsDialogOpen(true)}
        sx={{ color: theme.palette.text.primary }}
      >
        <CommentIcon />
        <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
          {recommendations.length} המלצות
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
            {recommendations.map((recommendation, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={recommendation.text} />
                  {currentUserId === recommendation.studentId && (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleDeleteRecommendation(recommendation.studentId)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {index < recommendations.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          {canAddComment && (
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