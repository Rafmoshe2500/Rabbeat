// ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'
import { Container, useTheme, useMediaQuery, Box, Typography } from '@mui/material';
import ProfileImage from '../components/profile/profile-image';
import ProfileInfo from '../components/profile/profile-info';
import ProfileVersions from '../components/profile/profile-versions';
import ProfileSamples from '../components/profile/profile-samples';
import ProfileRecommendations from '../components/profile/profile-recommendations';
import ProfileActions from '../components/profile/profile-actions';
import '../components/profile/user-profile.scss';
import { useUser } from "../contexts/user-context";
import { useGetProfile } from '../hooks/useProfile';


const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userDetails } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: profile, isLoading, error } = useGetProfile(id);
  const [editedProfile, setEditedProfile] = useState<teacherProfile | null>(null);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  if (!userDetails) return <div>User not logged in</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  if (!profile || !editedProfile) return <div>Profile not found</div>;

  const canEdit = userDetails.type === 'teacher' && userDetails.id === profile.id;
  const canAddComment = userDetails.type === 'student';

  const handleProfileUpdate = (updatedProfile: Partial<teacherProfile>) => {
    setEditedProfile({ ...editedProfile, ...updatedProfile });
    // Here you would typically call an API to update the profile
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
        <Box className="profile-header">
        {profile.type === 'teacher' ? <ProfileImage 
        profile={editedProfile} 
        canEdit={canEdit!!} 
        onUpdate={handleProfileUpdate} 
      /> : <></>}
    <Typography variant="h5">{profile.firstName} {profile.lastName}, {calculateAge(profile.birthDay)}</Typography>
    <br />
      <ProfileInfo 
        profile={editedProfile} 
        canEdit={canEdit!!} 
        onUpdate={handleProfileUpdate} 
      />
      {profile.type === 'teacher' ? <ProfileVersions 
        versions={editedProfile.versions} 
        canEdit={canEdit!!} 
        onUpdate={(versions) => handleProfileUpdate({ versions })} 
      />: <></>}
      <Box sx={{display: 'inline-flex'}}>
      {profile.type === 'teacher' ? <ProfileSamples 
        samples={editedProfile.sampleIds} 
        canEdit={canEdit!!} 
        onUpdate={(sampleIds) => handleProfileUpdate({ sampleIds })} 
      />: <></>}
      {profile.type === 'teacher' ? <ProfileRecommendations 
        recommendations={editedProfile.recommendations} 
        canAddComment={canAddComment!!}
        currentUserId={userDetails?.id}
        onUpdate={(recommendations) => handleProfileUpdate({ recommendations })} 
      />: <></>}
      </Box>
      {profile.type === 'teacher' ? <ProfileActions profile={editedProfile} />: <></>}
      </Box>
    </Container>
  );
};

export default Profile;