// TeacherCard.tsx
import React from 'react';
import { Card, CardContent, Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../profile/profile-image';
import ProfileInfo from '../profile/profile-info';
import ProfileActions from '../profile/profile-actions';
import ProfileRecommendations from '../profile/profile-recommendations';
import ProfileVersions from '../profile/profile-versions';
import ProfileSamples from '../profile/profile-samples';

interface TeacherCardProps {
  teacher: teacherProfile;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const navigate = useNavigate();

  const handleUpdate = (key: string, value: any) => {
    // Implement update logic here
    console.log(`Updating ${key} with value:`, value);
  };

  const handleImageClick = () => {
    navigate(`/profile/${teacher.id}`);
  };

  return (
    <Card>
      <CardContent dir='rtl'>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {`${teacher.firstName} ${teacher.lastName}`}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Button 
              onClick={handleImageClick} 
              sx={{ 
                padding: 0, 
                width: '100%', 
                height: '100%', 
                '&:hover': { opacity: 0.8 } 
              }}
            >
              <ProfileImage 
                profile={teacher}
                canEdit={false}
                onUpdate={handleUpdate}
              />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <ProfileInfo
              profile={teacher}
              canEdit={false}
              onUpdate={handleUpdate}
            />
          </Grid>
          <Grid item xs={2}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <ProfileVersions
                versions={teacher.versions}
                canEdit={false}
                onUpdate={(value) => handleUpdate('versions', value)}
              />
            </div>
          </Grid>
          <Grid item xs={3}>
            <ProfileActions
              profile={teacher}
              canEdit={false}
              onUpdate={handleUpdate}
            />
            <ProfileRecommendations
              recommendations={teacher.recommendations}
              canAddComment={false}
              currentUserId={undefined}
              onUpdate={handleUpdate}
            />
            <ProfileSamples
              samples={teacher.sampleIds}
              canEdit={false}
              onUpdate={handleUpdate}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TeacherCard;