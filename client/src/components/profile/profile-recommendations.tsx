// ProfileRecommendations.tsx
import React, { useState } from 'react';
import { Box, Chip, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field'

type Recommendation = {
  text: string;
  studentId: string;
};

type ProfileRecommendationsProps = {
  recommendations: Recommendation[];
  canAddComment: boolean;
  currentUserId?: string;
  onUpdate: (recommendations: Recommendation[]) => void;
};

const ProfileRecommendations: React.FC<ProfileRecommendationsProps> = ({ 
  recommendations, 
  canAddComment, 
  currentUserId, 
  onUpdate 
}) => {
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [newRecommendationDialogOpen, setNewRecommendationDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');

  const handleAddRecommendation = () => {
    if (newRecommendation && currentUserId) {
      onUpdate([...recommendations, { text: newRecommendation, studentId: currentUserId }]);
      setNewRecommendation('');
      setNewRecommendationDialogOpen(false);
    }
  };

  const handleDeleteRecommendation = (studentId: string) => {
    onUpdate(recommendations.filter(rec => rec.studentId !== studentId));
  };

  return (
    <Box>
      <Button onClick={() => setRecommendationsDialogOpen(true)}>
        הצג תגובות
      </Button>
      <DialogComponent
        open={recommendationsDialogOpen}
        title="תגובות סטודנטים"
        onClose={() => setRecommendationsDialogOpen(false)}
        onConfirm={() => setRecommendationsDialogOpen(false)}
      >
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {recommendations.map((recommendation, index) => (
            <Chip
              key={index}
              label={recommendation.text}
              onDelete={
                currentUserId === recommendation.studentId
                  ? () => handleDeleteRecommendation(recommendation.studentId)
                  : undefined
              }
              style={{ margin: '5px' }}
            />
          ))}
        </Box>
        {canAddComment && (
          <Button 
            onClick={() => setNewRecommendationDialogOpen(true)} 
            startIcon={<AddIcon />}
            color="primary"
          >
            הוסף המלצה חדשה
          </Button>
        )}
      </DialogComponent>

      <DialogComponent
        open={newRecommendationDialogOpen}
        title="הוסף המלצה חדשה"
        onClose={() => setNewRecommendationDialogOpen(false)}
        onConfirm={handleAddRecommendation}
      >
        <RTLTextField
          autoFocus
          margin="dense"
          label="המלצה חדשה"
          fullWidth
          value={newRecommendation}
          onChange={(e) => setNewRecommendation(e.target.value)}
        />
      </DialogComponent>
    </Box>
  );
};

export default ProfileRecommendations;