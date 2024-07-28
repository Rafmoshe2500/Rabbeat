import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useUser } from "../../contexts/user-context";
import RabBeatLogo from '../../assets/images/RabBeat-logo.png';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    navigate("/login");
    handleCloseUserMenu();
  };


  const commonPages = [
    { label: "חיפוש מרצה", path: "/search", icon: <SearchIcon /> },
  ];

  const userPages = userDetails
    ? userDetails.type === "student"
      ? [
          {
            label: "אזור תלמיד",
            path: "/student-personal-area",
            icon: <PersonIcon />,
          },
          ...commonPages,
        ]
      : [
          {
            label: "אזור מורה",
            path: "/teacher-personal-area",
            icon: <PersonIcon />,
          },
          {
            label: "העלאת שיעור",
            path: "/upload-lesson",
            icon: <UploadFileIcon />,
          },
          { label: "התלמידים שלי", path: "/my-students", icon: <SchoolIcon /> },
        ]
    : [
        { label: "התחברות", path: "/login", icon: <PersonIcon /> },
        { label: "הרשמה", path: "/register", icon: <PersonIcon /> },
        ...commonPages,
      ];

  const pages = [...userPages];

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main, marginBottom: theme.spacing(2.5) }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ flexDirection: 'row-reverse' }}>
          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <img src={RabBeatLogo} alt="RabBeat Logo" style={{ width: '120px', height: 'auto' }} />
              </Box>
              <IconButton
                size="large"
                aria-label="menu"
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
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem key={page.label} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                    {page.icon}
                    <Typography textAlign="center" sx={{ marginRight: 1 }}>{page.label}</Typography>
                  </MenuItem>
                  
                ))}
                {userDetails && (
                  <>
                    <MenuItem onClick={() => { handleCloseNavMenu(); navigate(`/profile/${userDetails.id}`); }}>
                      <AccountCircleOutlinedIcon />
                      <Typography textAlign="center" sx={{ marginRight: 1 }}>פרופיל</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppRoundedIcon />
                      <Typography textAlign="center" sx={{ marginRight: 1 }}>התנתק</Typography>
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                <img src={RabBeatLogo} alt="RabBeat Logo" style={{ width: '120px', height: 'auto' }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    component={Link}
                    to={page.path}
                    sx={{ color: 'white', marginRight: 2, display: 'flex', alignItems: 'center' }}
                  >
                    {page.icon}
                    <Typography sx={{ marginRight: 1 }}>{page.label}</Typography>
                  </Button>
                ))}
              </Box>
              {userDetails && (
            <Box sx={{ flexGrow: 0, mr: 2 }}>
              <Tooltip title="פתח הגדרות">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userDetails.firstName}
                    src="/src/public/images/profile.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate(`/profile/${userDetails.id}`);
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    פרופיל
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography
                    textAlign="center"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    התנתק
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;