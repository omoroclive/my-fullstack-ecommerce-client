import React, { useState } from "react";
import {
  Button,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { addProductFormElements } from "../../config/addProductElement";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");

    // Check for authentication token
    if (!authToken) {
      setNotification({ open: true, message: "No authentication token found", severity: "error" });
      return;
    }
    console.log("Auth Token:", authToken); // Log token for debugging

    // Log form data to ensure it's correct before sending
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        console.log("Selected images:", formData.images); // Log images for debugging

        for (let i = 0; i < formData.images.length; i++) {
          formDataToSubmit.append("images", formData.images[i]);
        }
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Log all keys and values in FormData to ensure they are populated correctly
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products", // Ensure the backend URL is correct
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            // Let axios handle the Content-Type for multipart/form-data
          },
        }
      );
      console.log('Response data:', response.data); // Log response data
      setNotification({ open: true, message: "Product added successfully!", severity: "success" });
      setFormData({
        title: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        salePrice: "",
        totalStock: "",
        images: [],
      });
    } catch (error) {
      // Log full error response for debugging
      console.error("Error adding product:", error.response || error.message);
      setNotification({ open: true, message: "Failed to add product. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {addProductFormElements.map((field) => {
          if (field.componentType === "input") {
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                fullWidth
                margin="normal"
              />
            );
          }
          if (field.componentType === "textarea") {
            return (
              <TextareaAutosize
                key={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={{ width: "100%", margin: "10px 0", padding: "8px" }}
              />
            );
          }
          if (field.componentType === "select") {
            return (
              <FormControl fullWidth margin="normal" key={field.name}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          if (field.componentType === "file") {
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            );
          }
          return null;
        })}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
        </Button>
      </form>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductForm;
