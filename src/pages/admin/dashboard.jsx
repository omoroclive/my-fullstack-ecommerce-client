import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import AddProductForm from "./addProduct";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "info", // success, error, info, warning
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:3000/admin-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(response.data.message || "Welcome to the Admin Dashboard");
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          err.response?.data?.message || "Access denied or session expired"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Add Product Logic
  const handleAddProduct = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorized");
      }

      const response = await axios.post("http://localhost:3000/api/products", product, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        severity: "success",
        message: "Product added successfully!",
      });

      handleCloseModal();
    } catch (err) {
      console.error("Error adding product:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to add product. Please try again.",
      });
    }
  };

  return (
    <div className="p-4">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Product
        </Button>
      </div>

      {/* Dashboard Content */}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{message}</p>
      )}

      {/* Add Product Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        className="flex justify-center items-center"
      >
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <AddProductForm
            onClose={handleCloseModal}
            onSubmit={(formData) => {
              const formDataToSubmit = new FormData();
              Object.keys(formData).forEach((key) => {
                if (key === "images") {
                  Array.from(formData[key]).forEach((file) =>
                    formDataToSubmit.append("images", file)
                  );
                } else {
                  formDataToSubmit.append(key, formData[key]);
                }
              });
              handleAddProduct(formDataToSubmit);
            }}
          />
        </div>
      </Modal>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
