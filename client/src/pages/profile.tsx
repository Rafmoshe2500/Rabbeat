import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, useTheme, useMediaQuery, Box, Typography } from '@mui/material';
import ProfileImage from '../components/profile/profile-image';
import ProfileInfo from '../components/profile/profile-info';
import ProfileVersions from '../components/profile/profile-versions';
import ProfileSamples from '../components/profile/profile-samples';
import ProfileRecommendations from '../components/profile/profile-recommendations';
import ProfileActions from '../components/profile/profile-actions';
import '../components/profile/user-profile.scss';
import { useUser } from "../contexts/user-context";
import { useGetProfile, useUpdateProfile } from '../hooks/useProfile';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userDetails } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: profile, isLoading, error } = useGetProfile(id);
  const updateProfileMutation = useUpdateProfile();
  const [editedProfile, setEditedProfile] = useState<teacherProfile | null>(null);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!profile || !editedProfile) return <div>Profile not found</div>;

  const canEdit = userDetails?.type === 'teacher' && userDetails.id === profile.id;
  const canAddComment = userDetails?.type === 'student';

  const handleProfileUpdate = (key: keyof teacherProfile, value: any) => {
    if (!editedProfile) return;
        setEditedProfile(prevProfile => ({
      ...prevProfile!,
      [key]: value
    }));
  
    const updateData = {
      id: editedProfile.id,
      key,
      value
    };  
    updateProfileMutation.mutate(updateData, {
      onError: (error) => {
        console.error("Failed to update profile:", error);
        setEditedProfile(profile);
      },
    });
  };
  const calculateAge = (birthDay: string) => {
    const [day, month, year] = birthDay.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

    return (
    <Container className="profile-page" maxWidth={isMobile ? "xs" : "sm"}>
      <Box className="profile-card">
        {profile.type === 'teacher' && (
          <ProfileImage 
          profile={editedProfile} 
          canEdit={canEdit} 
          onUpdate={(key, value) => handleProfileUpdate(key, value)} />
        )}
        <Typography variant="h5">
          {profile.firstName} {profile.lastName}, {calculateAge(profile.birthDay)}
        </Typography>
        <ProfileInfo 
          profile={editedProfile} 
          canEdit={canEdit} 
          onUpdate={handleProfileUpdate} 
        />
        {profile.type === 'teacher' && (
          <>
            <ProfileVersions 
              versions={editedProfile.versions} 
              canEdit={canEdit} 
              onUpdate={(value) => handleProfileUpdate('versions', value)} 
            />
            <Box sx={{display: 'inline-flex'}}>
              <ProfileSamples 
                samples={editedProfile.sampleIds} 
                canEdit={canEdit} 
                onUpdate={(key, value) => handleProfileUpdate(key, value)} />
            <ProfileRecommendations 
              recommendations={editedProfile.recommendations} 
              canAddComment={canAddComment}
              currentUserId={userDetails?.id}
              onUpdate={(key, value) => handleProfileUpdate(key, value)} 
            />
            </Box>
            <ProfileActions 
              profile={editedProfile} 
              canEdit={canEdit}
              onUpdate={(key, value) => handleProfileUpdate(key, value)}/>
            </>
        )}
      </Box>
    </Container>
  );
};

export default Profile;