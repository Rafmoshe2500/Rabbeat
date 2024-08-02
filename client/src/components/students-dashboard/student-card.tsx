import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Badge,
  Tooltip,
} from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

type StudentCardProps = {
  student: Partial<Student>;
};

const StudentCard = ({ student }: StudentCardProps) => {
  const navigate = useNavigate();
  const {
    id,
    firstName,
    lastName,
    phoneNumber,
    expired_date,
    updated,
  } = student;

  const isExpired = new Date(expired_date!) < new Date();
  const daysLeft = calculateDaysLeft(expired_date!);

  const onClick = () => {
    const route = `/my-students/${firstName}-${lastName}`;
    navigate(route, { state: { id } });
  };

  const getBorderColor = () => {
    if (isExpired) return "#9E9E9E";
    if (updated) return "#FFB74D";
    return "#4CAF50";
  };

  const getStatusColor = () => {
    if (isExpired) return "default";
    if (updated) return "warning";
    return "success";
  };

  const getStatusText = () => {
    if (isExpired) return "הסתיים";
    if (updated) return "קיים עדכון";
    return "פעיל";
  };

  return (
    <Box sx={{ minWidth: 275, maxWidth: 345, margin: "1rem" }}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          border: `1px solid ${getBorderColor()}`,
          transition: "0.3s",
          "&:hover": {
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="div" gutterBottom>
                {`${firstName} ${lastName}`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {updated && (
                  <Tooltip title="קיים עדכון" arrow>
                    <Badge color="primary" variant="dot">
                      <NotificationsActiveIcon />
                    </Badge>
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, marginLeft: '10px' }}>
                <PhoneIcon fontSize="small" sx={{ mb: 1 }} />
                <EventIcon fontSize="small" sx={{ mb: 1 }} />
                <AccessTimeIcon fontSize="small" color={isExpired ? "error" : "inherit"} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>{phoneNumber}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{formatDate(expired_date!)}</Typography>
                <Typography variant="body2" color={isExpired ? "error" : "inherit"}>
                  {isExpired ? "הסתיים" : `${daysLeft} ימים לסיום`}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Chip
                label={getStatusText()}
                size="small"
                color={getStatusColor()}
              />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

const calculateDaysLeft = (expiredDate: string) => {
  const today = new Date();
  const expirationDate = new Date(expiredDate);
  const timeDiff = expirationDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export default StudentCard;