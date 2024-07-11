import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";
import { useUser } from "../../contexts/user-context";
import styles from "./navbar.module.css";
import { options } from "marked";

const commonPages = [
  { label: "דף בית", path: "/" },
  { label: "חיפוש מרצה", path: "/search" },
];

const studentPages = [
  ...commonPages,
  { label: "אזור תלמיד", path: "/student-personal-area" },
];

const teacherPages = [
  ...commonPages,
  { label: "אזור מורה", path: "/teacher-personal-area" },
  { label: "העלאת שיעור", path: "/upload-lesson" },
];

const guestPages = [
  ...commonPages,
  { label: "התחברות", path: "/login" },
  { label: "הרשמה", path: "/register" },
];
// const pages = [
//   { label: "דף בית", path: "/" },
//   { label: "אזור תלמיד", path: "/student-personal-area" },
//   { label: "אזור מורה", path: "/teacher-personal-area" },
//   { label: "התחברות", path: "/login" },
//   { label: "הרשמה", path: "/register" },
//   { label: "העלאת שיעור", path: "/upload-lesson" },
// ];

const Navbar = () => {
  const navigate = useNavigate();
  const { setUserDetails, logout } = useUser();

  const setLogout = () => {
    logout()
    navigate("/login");
  };

  const moveToProfilePage = () => {
    navigate(`/profile/${userDetails?.id}`);
  };

  const settings = [
    { label: "פרופיל", onClick: moveToProfilePage },
    { label: "התנתק", onClick: setLogout },
  ];

  const { userDetails } = useUser();
  let pages = []
  if (!userDetails) {
    pages = guestPages;
  }
  else {
    pages = userDetails.type === "student" ? studentPages : teacherPages;

  }

  // const pages = userDetails.type === "student" ? studentPages : teacherPages;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    userDetails ? setAnchorElUser(event.currentTarget) : <></>
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" className={styles["app-bar"]}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Rabbeat
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link
                  key={page.label}
                  to={page.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link
                  to={page.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {page.label}
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Ad Matai" src="/public/images/profile.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.label} onClick={setting.onClick}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
