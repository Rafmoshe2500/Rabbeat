import React from "react";
import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

type StyledPaperProps = {
  $viewMode: "grid" | "list";
  $isExpired: boolean;
};

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "$viewMode" && prop !== "$isExpired",
})<StyledPaperProps>(({ $isExpired }) => ({
  padding: "16px",
  textAlign: "center",
  color: "#666666",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 16,
  transition: "all 0.3s",
  border: `2px solid ${$isExpired ? "#808080" : "#4CAF50"}`,
  "&:hover": {
    transform:"scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
}));

interface StudentCardProps {
  student: Student;
  viewMode: "grid" | "list";
}

const StudentCard: React.FC<StudentCardProps> = ({ student, viewMode }) => {
  const navigate = useNavigate();

  const onClick = () => {
    const route = `/my-students/${student.firstName}-${student.lastName}`;
    navigate(route, { state: { id: student.id } });
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

  const isExpired = new Date(student.expired_date) < new Date();
  const daysLeft = calculateDaysLeft(student.expired_date);

  return (
    <StyledPaper
      onClick={onClick}
      elevation={viewMode === "grid" ? 3 : 0}
      $viewMode={viewMode}
      $isExpired={isExpired}
    >
      <Typography variant={viewMode === "grid" ? "h5" : "body1"} gutterBottom>
        {`${student.firstName} ${student.lastName}`}
      </Typography>
      <Typography variant={viewMode === "grid" ? "h6" : "body2"}>
        {student.phoneNumber}
      </Typography>
      <Typography variant={viewMode === "grid" ? "body1" : "body2"}>
        {isExpired 
          ? "ימים לסיום: הסתיים" 
          : `ימים לסיום: ${daysLeft}`}
      </Typography>
      <Typography variant={viewMode === "grid" ? "body1" : "body2"}>
        {formatDate(student.expired_date)}
      </Typography>
    </StyledPaper>
  );
};

export default StudentCard;