import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Pagination,
  useTheme,
  TextField,
} from "@mui/material";
import { useGetAllTeachers } from "../hooks/useProfile";
import TeacherCard from "../components/common/teacher-card";
import withFade from "../hoc/withFade.hoc";
import SearchTeacherListSkeleton from "../components/skeletons/search-teacher-skeleton";

const TeacherSearch: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({
    fullName: "",
    address: "",
    versions: "",
  });

  const { data: teachers, isLoading, error } = useGetAllTeachers();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      [event.target.name]: event.target.value,
    });
  };

  const filteredTeachers =
    teachers?.filter(
      (teacher) =>
        (searchParams.fullName === "" ||
          `${teacher.firstName} ${teacher.lastName}`
            .toLowerCase()
            .includes(searchParams.fullName.toLowerCase())) &&
        (searchParams.address === "" ||
          teacher.address
            .toLowerCase()
            .includes(searchParams.address.toLowerCase())) &&
        (searchParams.versions === "" ||
          teacher.versions.some((v) =>
            v.toLowerCase().includes(searchParams.versions.toLowerCase())
          ))
    ) || [];

  const paginatedTeachers = filteredTeachers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (error)
    return (
      <Typography sx={{ color: theme.palette.error.main }}>
        An error has occurred: {error.message}
      </Typography>
    );

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography variant="h1" gutterBottom>
        חיפוש מורה לקריאה בתורה
      </Typography>
      {isLoading ? (
        <SearchTeacherListSkeleton />
      ) : (
        <>
          <Box
            sx={{
              marginBottom: theme.spacing(2),
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: theme.spacing(1),
            }}
          >
            <TextField
              dir="rtl"
              label="חפש לפי שם מלא"
              name="fullName"
              value={searchParams.fullName}
              onChange={handleSearch}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 4px)",
                  md: "calc(25% - 6px)",
                },
              }}
            />
            <TextField
              dir="rtl"
              label="חפש לפי כתובת"
              name="address"
              value={searchParams.address}
              onChange={handleSearch}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 4px)",
                  md: "calc(25% - 6px)",
                },
              }}
            />
            <TextField
              dir="rtl"
              label="חפש לפי סגנון"
              name="versions"
              value={searchParams.versions}
              onChange={handleSearch}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 4px)",
                  md: "calc(25% - 6px)",
                },
              }}
            />
            <Select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(e.target.value as number)}
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 4px)",
                  md: "calc(25% - 6px)",
                },
              }}
            >
              {[5, 10, 15, 20].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Grid container spacing={2}>
            {paginatedTeachers.map((teacher) => (
              <Grid item xs={12} key={teacher.id}>
                <TeacherCard teacher={teacher} />
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={Math.ceil(filteredTeachers.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              marginTop: theme.spacing(2),
              display: "flex",
              justifyContent: "center",
              "& .MuiPaginationItem-root": {
                color: theme.palette.text.primary,
              },
            }}
          />
        </>
      )}
    </Box>
  );
};

export default withFade(TeacherSearch);
