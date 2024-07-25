import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Container,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useUser } from '../../contexts/user-context';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userDetails, logout } = useUser();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };

  const commonPages = [
    { label: 'חיפוש מרצה', path: '/search', icon: <SearchIcon /> },
  ];

  const userPages = userDetails
    ? userDetails.type === 'student'
      ? [{ label: 'אזור תלמיד', path: '/student-personal-area', icon: <PersonIcon /> }, ...commonPages]
      : [
          { label: 'אזור מורה', path: '/teacher-personal-area', icon: <PersonIcon /> },
          { label: 'העלאת שיעור', path: '/upload-lesson', icon: <UploadFileIcon /> },
          { label: 'התלמידים שלי', path: '/my-students', icon: <SchoolIcon /> }
        ]
    : [
        { label: 'התחברות', path: '/login', icon: <PersonIcon /> },
        { label: 'הרשמה', path: '/register', icon: <PersonIcon />},
           ...commonPages
      ];

  const pages = [...userPages];

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: theme.palette.primary.main, 
      marginBottom: theme.spacing(2.5)
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ flexDirection: 'row-reverse' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, ml: 1, color: theme.palette.primary.contrastText }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                ml: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.text.primary
                }
              }}
            >
              Rabbeat
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                  {page.icon}
                  <Typography textAlign="center" sx={{ mr: 1, color: theme.palette.text.primary }}>
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  my: 2, 
                  color: theme.palette.primary.contrastText, 
                  display: 'flex', 
                  alignItems: 'center', 
                  ml: 2,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    color: theme.palette.text.secondary
                  }
                }}
              >
                {page.icon}
                <Typography sx={{ mr: 1 }}>{page.label}</Typography>
              </Button>
            ))}
          </Box>

          {userDetails && (
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <Tooltip title="פתח הגדרות">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userDetails.firstName} src="/public/images/profile.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => { handleCloseUserMenu(); navigate(`/profile/${userDetails.id}`); }}>
                  <Typography textAlign="center" sx={{ color: theme.palette.text.primary }}>פרופיל</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center" sx={{ color: theme.palette.text.primary }}>התנתק</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1, color: theme.palette.primary.contrastText }} />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
              }}
            >
              Rabbeat
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;