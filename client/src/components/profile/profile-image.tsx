import React, { useState, useEffect } from 'react';
import { Box, Avatar } from '@mui/material';
import { FaCamera } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';

type ProfileImageProps = {
  profile: teacherProfile;
  canEdit: boolean;
  onUpdate: (key: 'image', value: string) => void;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ profile, canEdit, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setLocalImage(profile.image);
  }, [profile.image]);

  const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const elem = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          elem.width = width;
          elem.height = height;
          const ctx = elem.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const data = ctx?.canvas.toDataURL('image/jpeg', quality);
          resolve(data as string);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canEdit && event.target.files && event.target.files[0]) {
      try {
        const compressedImage = await compressImage(event.target.files[0], 300, 300, 0.7);
        setLocalImage(compressedImage);
        onUpdate('image', compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
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
        marginBottom: theme.spacing(2.5),
        cursor: canEdit ? 'pointer' : 'default',
        borderRadius: '50%',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => canEdit && document.getElementById('imageUpload')?.click()}
    >
      <Avatar 
        src={localImage || profile.image} 
        alt="Profile" 
        sx={{ 
          width: '100%', 
          height: '100%',
          transition: theme.transitions.create('opacity', {
            duration: theme.transitions.duration.short,
          }),
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
            opacity: isHovered ? 1 : 0,
            transition: theme.transitions.create('opacity', {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <FaCamera size={40} color={theme.palette.common.white} />
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