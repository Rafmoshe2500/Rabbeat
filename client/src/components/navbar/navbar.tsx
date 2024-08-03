import React, { useState, useEffect, useCallback } from "react";
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
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useUser } from "../../contexts/user-context";
import RabBeatLogo from "../../assets/images/RabBeat-logo.png";

type PageLink = {
  label: string;
  path: string;
  icon: JSX.Element;
  onClick?: () => void;
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { userDetails, logout } = useUser();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

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

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < lastScrollPos || currentScrollPos < 10;

    setVisible(visible);
    setLastScrollPos(currentScrollPos);
  }, [lastScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const searchTeacherPage = {
    label: "חיפוש מורה",
    path: "/search",
    icon: <SearchIcon />,
  };

  const loggedInCommonPages = [
    {
      label: "התנתק",
      path: `/login`,
      icon: <ExitToAppRoundedIcon />,
      onClick: handleLogout,
    },
    {
      label: "פרופיל",
      path: `/profile/${userDetails?.id}`,
      icon: <AccountCircleOutlinedIcon />,
    },
  ];

  const studentPages = [
    searchTeacherPage,
    {
      label: "השיעורים שלי",
      path: "/student-personal-area",
      icon: <PersonIcon />,
    },
  ];

  const teacherPages = [
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
    {
      label: "התלמידים שלי",
      path: "/my-students",
      icon: <SchoolIcon />,
    },
  ];

  const guestPages = [
    { label: "הרשמה", path: "/register", icon: <PersonIcon /> },
    { label: "התחברות", path: "/login", icon: <PersonIcon /> },
    searchTeacherPage,
  ];

  const getPages = () => {
    if (!userDetails) return guestPages;

    const userSpecificPages =
      userDetails.type === "student" ? studentPages : teacherPages;

    return isMobile
      ? [...loggedInCommonPages, ...userSpecificPages]
      : userSpecificPages;
  };

  const pages: PageLink[] = getPages();

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: 1,
        backgroundColor: theme.palette.primary.main,
        transition: "top 0.3s",
        top: visible ? 0 : "-64px", // Adjust this value based on your AppBar height
        marginBottom: "3rem",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ flexDirection: "row-reverse" }}>
          {isMobile ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={RabBeatLogo}
                  alt="RabBeat Logo"
                  style={{ width: "120px", height: "auto" }}
                />
              </Box>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon color="secondary" />
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
                {pages.reverse().map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={page.onClick ? page.onClick : handleCloseNavMenu}
                    component={Link}
                    to={page.path}
                    sx={{ direction: "rtl" }}
                  >
                    {page.icon}

                    <Typography textAlign="right" sx={{ marginRight: 0 }}>
                      {page.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}
              >
                <img
                  src={RabBeatLogo}
                  alt="RabBeat Logo"
                  style={{ width: "120px", height: "auto" }}
                />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page.label}
                    component={Link}
                    to={page.path}
                    sx={{
                      color: "white",
                      marginRight: 2,
                      display: "flex",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
                    {page.icon}
                    <Typography sx={{ marginRight: 1 }}>
                      {page.label}
                    </Typography>
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
                    {loggedInCommonPages.reverse().map((page) => (
                      <MenuItem
                        key={page.label}
                        onClick={
                          page.onClick ? page.onClick : handleCloseNavMenu
                        }
                        component={Link}
                        to={page.path}
                        sx={{ direction: "rtl" }}
                      >
                        {page.icon}

                        <Typography textAlign="right" sx={{ marginRight: 0 }}>
                          {page.label}
                        </Typography>
                      </MenuItem>
                    ))}
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
