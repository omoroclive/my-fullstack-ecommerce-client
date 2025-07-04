import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddressFormControls from "../../config/address";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Fetch addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError(error.response?.data?.message || "Failed to fetch addresses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle Add Address Button Click
  const handleAddAddress = () => {
    setIsEditMode(false);
    setIsDialogOpen(true);
    setFormValues({});
  };

  // Handle Edit Address
  const handleEditAddress = (address) => {
    setIsEditMode(true);
    setEditingAddressId(address._id);
    setFormValues(address);
    setIsDialogOpen(true);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      if (isEditMode) {
        // Edit Address API call
        await axios.put(`${API_BASE_URL}/${editingAddressId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddressId ? { ...formData, _id: editingAddressId } : addr
          )
        );
        setSnackbar({
          open: true,
          message: "Address updated successfully.",
          severity: "success",
        });
      } else {
        // Add Address API call
        const response = await axios.post(API_BASE_URL, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses((prev) => [...prev, response.data.address]);
        setSnackbar({
          open: true,
          message: "Address added successfully.",
          severity: "success",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving address:", error);
      setSnackbar({
        open: true,
        message: "Failed to save address.",
        severity: "error",
      });
    }
  };

  // Handle Address Deletion
  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses((prev) => prev.filter((address) => address._id !== addressId));
      setSnackbar({
        open: true,
        message: "Address deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting address:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete address.",
        severity: "error",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Address Book</h1>

      {/* Address List */}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : addresses.length > 0 ? (
        <ul className="space-y-4">
          {addresses.map((address) => (
            <li
              key={address._id}
              className="p-4 border rounded-md shadow hover:shadow-lg transition-all relative"
            >
              <div>
                <p className="font-semibold">{address.fullName}</p>
                <p>{address.streetAddress}</p>
                <p>
                  {address.city}, {address.state} - {address.zipCode}
                </p>
                <p>{address.country}</p>
                <p>{address.phoneNumber}</p>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <IconButton color="primary" onClick={() => handleEditAddress(address)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteAddress(address._id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No addresses found. Add one to get started!</p>
      )}

      {/* Add Address Button */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddAddress}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          backgroundColor: "#1e3a8a",
          "&:hover": { backgroundColor: "#1e40af" },
        }}
      >
        Add Address
      </Button>

      {/* Add/Edit Address Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { padding: "16px", borderRadius: "8px" },
        }}
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {isEditMode ? "Edit Address" : "Add Address"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit(formValues);
            }}
          >
            <Grid container spacing={3}>
              {AddressFormControls.map((control) => (
                <Grid item xs={12} sm={6} key={control.name}>
                  <TextField
                    fullWidth
                    label={control.label}
                    name={control.name}
                    type={control.type}
                    value={formValues[control.name] || ""}
                    onChange={(e) =>
                      setFormValues({ ...formValues, [control.name]: e.target.value })
                    }
                    placeholder={control.placeholder}
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              {isEditMode ? "Update Address" : "Save Address"}
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddressBook;
