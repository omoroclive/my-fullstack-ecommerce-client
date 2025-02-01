import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md z-50">
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
    </header>
  );
};

export default Header;
