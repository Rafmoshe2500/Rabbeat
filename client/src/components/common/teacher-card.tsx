// TeacherCard.tsx
import React from 'react';
import Divider from '@mui/material/Divider';
import { Card, CardContent, Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '../profile/profile-image';
import ProfileInfo from '../profile/profile-info';
import ProfileActions from '../profile/profile-actions';
import ProfileVersions from '../profile/profile-versions';
import ProfileRecommendations from '../profile/profile-recommendations';
import {useUser} from '../../contexts/user-context' 
import ProfileSamples from '../profile/profile-samples';
import { useUpdateProfile } from '../../hooks/useProfile';

interface TeacherCardProps {
  teacher: teacherProfile;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const navigate = useNavigate();
  const updateProfileMutation = useUpdateProfile();
  const {userDetails} = useUser()
  const isUserConnected = userDetails && (userDetails.type === 'student' || userDetails.type === 'teacher');

  const handleProfileUpdate = (key: keyof teacherProfile, value: Array<Recommendation>) => {
  
    const updateData = {
      id: userDetails!.id,
      key,
      value
    };  
    updateProfileMutation.mutate(updateData, {
    });
  };

  const handleUpdate = (key: string, value: any) => {
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
        <Divider orientation="horizontal" flexItem sx={{marginBottom: '5px'}}/>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              onClick={handleImageClick} 
              sx={{ 
                padding: 0, 
                width: '100%', 
                height: 'auto', 
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
          <Grid item xs={12} sm={6} md={4}>
            <ProfileInfo
              profile={teacher}
              canEdit={false}
              onUpdate={handleUpdate}
            />
          </Grid>
          <Divider orientation="horizontal" flexItem sx={{marginBottom: '1px'}}/>
          <Grid item xs={12} sm={6} md={2}>
            <ProfileVersions
              versions={teacher.versions}
              canEdit={false}
              onUpdate={(value) => handleUpdate('versions', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grid container >
              <Grid item xs={6}>
                <ProfileRecommendations
                  recommendations={teacher.recommendations}
                  canAddComment={userDetails?.type === 'student'}
                  onUpdate={(key, value) => handleProfileUpdate(key, value)}
                />
              </Grid>
              <Grid item xs={6}>
                <ProfileSamples 
                  onUpdate={handleUpdate} 
                  samples={teacher.sampleIds} 
                  canEdit={false} 
                />
              </Grid>
              {isUserConnected && (
                <Grid item xs={12}>
                  <ProfileActions
                    profile={teacher}
                    canEdit={false}
                    onUpdate={handleUpdate}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default TeacherCard;