import { Skeleton, Box, Grid } from "@mui/material";

const TeacherSkeleton = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Grid>
        <Grid item xs={4}>
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>

      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Skeleton variant="circular" width={60} height={60} />
          </Grid>
          <Grid item xs={8}>
            <Skeleton variant="rectangular" width="100%" height={60} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const SearchTeacherListSkeleton = () => {
  // Assuming there are multiple teachers
  return (
    <Box>
      {[...Array(16)].map((_) => (
        <TeacherSkeleton />
      ))}
    </Box>
  );
};

export default SearchTeacherListSkeleton;
