import React, { useState, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Work as JobIcon,
  People as CustomersIcon,
  Assignment as PipelinesIcon,
} from "@mui/icons-material";
import Footer from "./Footer";

const drawerWidth = 240;

// Define menu items with role access
const allMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    roles: ["admin", "recruiter", "hiring_manager", "applicant"],
  },
  {
    text: "Jobs",
    icon: <JobIcon />,
    path: "/jobs",
    roles: ["admin", "recruiter", "hiring_manager", "applicant"],
  },
  {
    text: "Customers",
    icon: <CustomersIcon />,
    path: "/customers",
    roles: ["admin"],
  },
  {
    text: "Pipelines",
    icon: <PipelinesIcon />,
    path: "/pipelines",
    roles: ["admin", "recruiter", "hiring_manager"],
  },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get user data from localStorage
  const user = useMemo(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : {};
  }, []);

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    return allMenuItems.filter((item) => item.roles.includes(user.role));
  }, [user.role]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.contrastText
                    : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Job Tracker - {user.role?.replace("_", " ").toUpperCase()}
          </Typography>
          <IconButton
            onClick={handleMenuClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user.firstName?.[0]?.toUpperCase() || "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: "64px",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)", // Subtract AppBar height
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;
