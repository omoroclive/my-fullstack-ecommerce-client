import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccountManagement = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000";

  // Fetch user preferences including dark mode
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get(`${API_BASE_URL}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsDarkMode(response.data.isDarkMode); 
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    fetchUserPreferences();
  }, []);

  // Handle Password Change
  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.post(
        `${API_BASE_URL}/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsSuccessMessage("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setIsSuccessMessage("Failed to update password. Please try again.");
    } finally {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      await axios.delete(`${API_BASE_URL}/api/account/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.clear();
      alert("Your account has been deleted successfully.");
      navigate("/auth/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  // Handle Dark Mode Toggle
  const handleToggleDarkMode = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await axios.post(
        `${API_BASE_URL}/api/user/toggle-dark-mode`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsDarkMode(response.data.isDarkMode);
    } catch (error) {
      console.error("Error toggling dark mode:", error);
    }
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto rounded-lg shadow-lg transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Account Management</h1>

      {/* Dark Mode Toggle Button */}
      <section className="mb-8">
        <Button variant="contained" color="primary" onClick={handleToggleDarkMode} className="w-full">
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </section>

      {/* Change Password Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"}`}
        />
        <Button variant="contained" color="primary" onClick={handleChangePassword} className="mt-4 w-full">
          Update Password
        </Button>
        {isSuccessMessage && <p className="text-green-500 mt-2 text-center">{isSuccessMessage}</p>}
      </section>

      {/* Delete Account Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
        <p className="mb-4">Deleting your account is irreversible. All your data will be permanently deleted.</p>
        <Button variant="outlined" color="secondary" onClick={() => setIsDialogOpen(true)} className="w-full">
          Delete Account
        </Button>
      </section>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className={isDarkMode ? "dark:bg-gray-800" : ""}>
        <DialogTitle className={isDarkMode ? "text-white" : ""}>{"Delete Your Account?"}</DialogTitle>
        <DialogContent>
          <DialogContentText className={isDarkMode ? "text-gray-300" : ""}>
            Are you sure you want to delete your account? This action is irreversible and all your data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { handleDeleteAccount(); setIsDialogOpen(false); }} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccountManagement;
