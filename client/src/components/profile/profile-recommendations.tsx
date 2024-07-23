import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography,  IconButton } from '@mui/material';
import { Add as AddIcon, Comment as CommentIcon } from '@mui/icons-material';
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
  const [localRecommendations, setLocalRecommendations] = useState<Recommendation[]>([]);
  const [recommendationsDialogOpen, setRecommendationsDialogOpen] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState('');
  const theme = useTheme();

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
    <Box sx={{ marginTop: theme.spacing(2.5), display: 'flex', justifyContent: 'center' }}>
        <IconButton 
          onClick={() => setRecommendationsDialogOpen(true)}
          sx={{ color: theme.palette.text.primary }}
        >
          <CommentIcon />
          <Typography variant="caption" sx={{ ml: theme.spacing(1) }}>
            {recommendations.length } המלצות
          </Typography>
        </IconButton>
      <DialogComponent
        open={recommendationsDialogOpen}
        title="תגובות סטודנטים"
        onClose={() => setRecommendationsDialogOpen(false)}
        onConfirm={handleConfirm}
      >
        <Box sx={{ marginTop: theme.spacing(2.5), width: '100%' }}>
          <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ marginBottom: theme.spacing(2.5) }}>
            {localRecommendations.map((recommendation, index) => (
              <Chip
                key={index}
                label={recommendation.text}
                onDelete={
                  currentUserId === recommendation.studentId
                    ? () => handleDeleteRecommendation(recommendation.studentId)
                    : undefined
                }
                sx={{ margin: theme.spacing(0.625), bgcolor: theme.palette.secondary.light, color: theme.palette.text.primary }}
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