import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography,  IconButton } from '@mui/material';
import { Add as AddIcon, Comment as CommentIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import RTLTextField from '../common/rtl-text-field';

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
  const [localRecommendations, setLocalRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');

  useEffect(() => {
    setLocalRecommendations(Array.isArray(recommendations) ? recommendations : []);
  }, [recommendations]);

  const handleAddRecommendation = () => {
    if (newRecommendation && currentUserId) {
      setLocalRecommendations(prevRecs => [...prevRecs, { text: newRecommendation, studentId: currentUserId }]);
      setNewRecommendation('');
    }
  };

  const handleDeleteRecommendation = (studentId: string) => {
    setLocalRecommendations(prevRecs => prevRecs.filter(rec => rec.studentId !== studentId));
  };

  const handleConfirm = () => {
    onUpdate('recommendations', localRecommendations);
    setRecommendationsDialogOpen(false);
  };

  return (
    <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <IconButton 
          onClick={() => setRecommendationsDialogOpen(true)}
          sx={{ color: 'black' }}
        >
          <CommentIcon />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {recommendations.length } המלצות
          </Typography>
        </IconButton>
      <DialogComponent
        open={recommendationsDialogOpen}
        title="תגובות סטודנטים"
        onClose={() => setRecommendationsDialogOpen(false)}
        onConfirm={handleConfirm}
      >
        <Box sx={{ marginTop: '20px', width: '100%' }}>
          <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ marginBottom: '20px' }}>
            {localRecommendations.map((recommendation, index) => (
              <Chip
                key={index}
                label={recommendation.text}
                onDelete={
                  currentUserId === recommendation.studentId
                    ? () => handleDeleteRecommendation(recommendation.studentId)
                    : undefined
                }
                sx={{ margin: '5px' }}
              />
            ))}
          </Box>
          {canAddComment && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RTLTextField dir='rtl'
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="הוסף תגובה חדשה"
                sx={{ flexGrow: 1, marginRight: '10px' }}
              />
              <IconButton
                color="primary"
                onClick={handleAddRecommendation}
                sx={{ padding: '8px' }}
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