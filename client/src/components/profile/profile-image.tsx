import React, { useState, useEffect, useCallback } from 'react';
import { Box, Avatar, Modal, Button, Slider } from '@mui/material';
import { FaCamera } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import Cropper from 'react-easy-crop';

type ProfileImageProps = {
  profile: {
    image: string;
  };
  canEdit: boolean;
  onUpdate: (key: 'image', value: string) => void;
};

const ProfileImage: React.FC<ProfileImageProps> = ({ profile, canEdit, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setLocalImage(profile.image);
  }, [profile.image]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    console.log(croppedArea)
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canEdit && event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalImage(e.target?.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const compressImage = (file: File | Blob, maxWidth: number, maxHeight: number, quality: number): Promise<string> => {
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

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg');
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const handleCropConfirm = async () => {
    if (croppedAreaPixels && localImage) {
      try {
        const croppedImage = await getCroppedImg(localImage, croppedAreaPixels);
        const compressedImage = await compressImage(croppedImage, 300, 300, 0.7);
        setLocalImage(compressedImage);
        onUpdate('image', compressedImage);
        setIsCropModalOpen(false);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  };

  return (
    <>
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

      <Modal open={isCropModalOpen} onClose={() => setIsCropModalOpen(false)}>
        <Box sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <div style={{ position: 'relative', width: '100%', height: 300 }}>
            <Cropper
              image={localImage || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(_, newZoom) => setZoom(newZoom as number)}
            sx={{ marginTop: 2 }}
          />
          <Button onClick={handleCropConfirm} variant="contained" sx={{ marginTop: 2 }}>
            אשר
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileImage;