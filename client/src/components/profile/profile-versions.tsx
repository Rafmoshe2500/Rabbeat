import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, Select, MenuItem } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DialogComponent from '../common/dialog';
import { useTheme } from '@mui/material/styles';
import { lessonVersionsMapper } from "../../utils/utils";

type ProfileVersionsProps = {
  versions: string[] | undefined;
  canEdit: boolean;
  onUpdate: (value: string[]) => void;
};

type VersionKey = keyof typeof lessonVersionsMapper;

const ProfileVersions: React.FC<ProfileVersionsProps> = ({ versions = [], canEdit, onUpdate }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVersion, setNewVersion] = useState<VersionKey | ''>('');
  const [localVersions, setLocalVersions] = useState<string[]>(versions);
  const [availableVersions, setAvailableVersions] = useState<Record<VersionKey, string>>({} as Record<VersionKey, string>);
  const theme = useTheme();

  useEffect(() => {
    // Filter out already selected versions
    const filteredVersions = Object.entries(lessonVersionsMapper).reduce((acc, [key, value]) => {
      if (!localVersions.includes(value)) {
        acc[key as VersionKey] = value;
      }
      return acc;
    }, {} as Record<VersionKey, string>);
    setAvailableVersions(filteredVersions);
  }, [localVersions]);

  const handleAddVersion = () => {
    if (newVersion && newVersion in lessonVersionsMapper) {
      setLocalVersions([...localVersions, lessonVersionsMapper[newVersion]]);
      setNewVersion('');
      setDialogOpen(false);
    }
  };

  const handleDeleteVersion = (version: string) => {
    setLocalVersions(localVersions.filter(v => v !== version));
  };

  const handleSaveChanges = () => {
    onUpdate(localVersions);
  };

  return (
    <Box sx={{direction: 'rtl', color: theme.palette.text.primary}}>
      <Typography variant="h6">סגנונות קריאה:</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: theme.spacing(1), mb: theme.spacing(2) }}>
        {localVersions.map((version, index) => (
          <Chip 
            key={index} 
            label={version} 
            onDelete={canEdit ? () => handleDeleteVersion(version) : undefined}
            sx={{ 
              backgroundColor: theme.palette.secondary.light, 
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: theme.palette.secondary.main }
            }} 
          />
        ))}
        {canEdit && Object.keys(availableVersions).length > 0 && (
          <Chip
            variant='outlined'
            icon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            color="primary"
            style={{ margin: theme.spacing(0.625), direction:'ltr'}}
          />
        )}
      </Box>
      {canEdit && JSON.stringify(localVersions) !== JSON.stringify(versions) && (
        <Button onClick={handleSaveChanges} color="primary">
          שמור שינויים
        </Button>
      )}
      <DialogComponent
        open={dialogOpen}
        title="הוסף סגנון קריאה חדש"
        onClose={() => setDialogOpen(false)}
        onConfirm={handleAddVersion}
      >
        <Select
          autoFocus
          fullWidth
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value as VersionKey)}
          sx={{ direction: "rtl" }}
        >
          {(Object.keys(availableVersions) as VersionKey[]).map((key) => (
            <MenuItem key={key} sx={{ direction: "rtl" }} value={key}>
              {availableVersions[key]}
            </MenuItem>
          ))}
        </Select>
      </DialogComponent>
    </Box>
  );
};

export default ProfileVersions;