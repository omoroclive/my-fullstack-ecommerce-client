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

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  



  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      setOpenSnackbar(true);
      setTimeout(() => navigate("/auth/login"), 1500);
    } else {
      navigate("/account"); // or wherever the user dashboard is
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md z-50">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%', backgroundColor: '#ea580c', color: '#fff' }}>
          You must be logged in to access your account.
        </Alert>
      </Snackbar>

      {/* Hamburger Menu */}
      <button
        onClick={toggleSidebar}
        className="block md:hidden p-2 text-white bg-black rounded"
      >
        {isSidebarOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
      </button>

      {/* Logo and Title */}
      <div className="flex items-center">
        <div className="bg-white rounded-full h-10 w-10 flex justify-center items-center text-blue-600 font-bold shadow">
          A
        </div>
        <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Right-side icons */}
      <div className="flex items-center gap-4">
        {/* User Icon */}
        <IconButton onClick={handleUserClick} sx={{ color: 'white' }}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          className="capitalize"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
