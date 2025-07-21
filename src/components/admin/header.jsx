import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      setOpenSnackbar(true);
      setTimeout(() => navigate("/auth/login"), 1500);
    } else {
      navigate("/account");
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        padding: { xs: '0 8px', sm: '0 16px' }
      }}>
        {/* Left side - Hamburger and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            marginLeft: { xs: '8px', sm: '0' }
          }} onClick={() => navigate("/")}>
            <Box sx={{
              backgroundColor: '#ea580c',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '8px'
            }}>
              A
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}>
              Dashboard
            </Typography>
          </Box>
        </Box>

        {/* Right side - User and Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            onClick={handleUserClick}
            sx={{ marginRight: { xs: '4px', sm: '8px' } }}
          >
            <AccountCircleIcon />
          </IconButton>

          {isAuthenticated && (
            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'inherit',
                textTransform: 'capitalize',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="warning"
          sx={{ width: '100%' }}
        >
          You must be logged in to access your account.
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;