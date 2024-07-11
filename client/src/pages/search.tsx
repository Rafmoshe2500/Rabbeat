// TeacherSearch.tsx
import React, { useState } from 'react';
import {   Box,   Grid,   Typography,   Select,   MenuItem,  Pagination
} from '@mui/material';
import { useGetAllTeachers } from '../hooks/useProfile';
import TeacherCard from '../components/common/teacher-card';
import RTLTextField from '../components/common/rtl-text-field';

const TeacherSearch: React.FC = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useState({
    address: '',
    version: '',
    firstName: ''
  });

  const { data: teachers, isLoading, error } = useGetAllTeachers();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, [event.target.name]: event.target.value });
  };

  const filteredTeachers = teachers?.filter(teacher => 
    (searchParams.address === '' || teacher.address.toLowerCase().includes(searchParams.address.toLowerCase())) &&
    (searchParams.version === '' || teacher.versions.some(v => v.toLowerCase().includes(searchParams.version.toLowerCase()))) &&
    (searchParams.firstName === '' || teacher.firstName.toLowerCase().includes(searchParams.firstName.toLowerCase()))
  ) || [];

  const paginatedTeachers = filteredTeachers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error has occurred: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 2 }} color={'white'}>
      <Typography variant="h4" gutterBottom>Teacher Search</Typography>
      
      <Box sx={{ marginBottom: 2 ,color: 'white'}} >
        <RTLTextField dir='rtl'
          label="חפש לפי כתובת" 
          name="address"
          value={searchParams.address}
          onChange={handleSearch}
          sx={{ marginRight: 1 , color: 'white'}}
        />
        <RTLTextField dir='rtl' 
          label="חפש לפי סגנון" 
          name="version"
          value={searchParams.version}
          onChange={handleSearch}
          sx={{ marginRight: 1 , color: 'white'}}
        />
        <RTLTextField dir='rtl' 
          label="חפש לפי שם" 
          name="name"
          value={searchParams.firstName}
          onChange={handleSearch}
          sx={{ marginRight: 1 , color: 'white'}}
        />
        <Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(e.target.value as number)}
        >
          {[5, 10, 15, 20].map(num => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={2}>
        {paginatedTeachers.map(teacher => (
          <Grid item xs={12} key={teacher.id}>
            <TeacherCard teacher={teacher} />
          </Grid>
        ))}
      </Grid>

      <Pagination 
        count={Math.ceil(filteredTeachers.length / itemsPerPage)} 
        page={page} 
        onChange={(_, value) => setPage(value)}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default TeacherSearch;