// ProfileHeader.tsx
import React, { useState } from 'react';
import { Box, Avatar } from '@mui/material';
import { FaCamera } from 'react-icons/fa';

type ProfileHeaderProps = {
  profile: teacherProfile;
  canEdit: boolean;
  onUpdate: (updatedProfile: Partial<teacherProfile>) => void;
};

const ProfileImage: React.FC<ProfileHeaderProps> = ({ profile, canEdit, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canEdit && event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          onUpdate({ image: e.target.result as string });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
      <Box 
        className="profile-image-container" 
        sx={{ 
          position: 'relative', 
          width: '150px', 
          height: '150px', 
          margin: 'auto',
          marginBottom: '20px',
          cursor: canEdit ? 'pointer' : 'default'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => canEdit && document.getElementById('imageUpload')?.click()}
      >
        <Avatar 
          src={profile.image} 
          alt="Profile" 
          sx={{ 
            width: '100%', 
            height: '100%',
            transition: 'opacity 0.3s'
          }} 
        />
        {canEdit && isHovered && (
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(200, 200, 200, 0.7)',
              borderRadius: '50%',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s'
            }}
          >
            <FaCamera size={40} color="#ffffff" />
          </Box>
        )}
        <input 
          type="file" 
          id="imageUpload" 
          style={{ display: 'none' }} 
          onChange={handleImageChange} 
          accept="image/*"
        />
    </Box>
  );
};

export default ProfileImage;