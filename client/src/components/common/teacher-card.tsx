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

interface TeacherCardProps {
  teacher: teacherProfile;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const navigate = useNavigate();
  const {userDetails} = useUser()
  const isUserConnected = userDetails && (userDetails.type === 'student' || userDetails.type === 'teacher');

  const handleImageClick = () => {
    navigate(`/profile/${teacher.id}`);
  };

  return (
    <Card>
      <CardContent dir='rtl'>
        <Typography variant="h2" component="h2" gutterBottom align="center">
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
                onUpdate={() => {}}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ProfileInfo
              profile={teacher}
              canEdit={false}
              onUpdate={() => {}}
            />
          </Grid>
          <Divider orientation="horizontal" flexItem sx={{marginBottom: '1px'}}/>
          <Grid item xs={12} sm={6} md={2}>
            <ProfileVersions
              versions={teacher.versions}
              canEdit={false}
              onUpdate={() => {}}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Grid container >
              <Grid item xs={6}>
              <ProfileRecommendations
                recommendations={teacher.recommendations}
                teacherId={teacher.id}
                currentUserId={userDetails?.id}
              />
              </Grid>
              <Grid item xs={6}>
                <ProfileSamples 
                  teacherId={teacher.id} 
                  countSample={teacher.sampleIds.length}
                />
              </Grid>
              {isUserConnected && (
                <Grid item xs={12}>
                  <ProfileActions
                    profile={teacher}
                    canEdit={false}
                    onUpdate={() => {}}
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