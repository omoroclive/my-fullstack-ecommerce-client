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
    color: "",
    size: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      setNotification({ 
        open: true, 
        message: "No authentication token found", 
        severity: "error" 
      });
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || 
        !formData.brand || !formData.price || !formData.totalStock) {
      setNotification({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => {
          formDataToSubmit.append("images", file);
        });
      } else if (formData[key] !== "") { // Only append if value exists
        formDataToSubmit.append(key, formData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await axios.post(
         "https://ecommerce-server-c6w5.onrender.com/api/products",
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      setNotification({ 
        open: true, 
        message: "Product added successfully!", 
        severity: "success" 
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        salePrice: "",
        totalStock: "",
        color: "",
        size: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to add product. Please try again.",
        severity: "error",
      });
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
                required={field.required}
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
                required={field.required}
              />
            );
          }
          if (field.componentType === "select") {
            return (
              <FormControl 
                fullWidth 
                margin="normal" 
                key={field.name}
                required={field.required}
              >
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
                required={field.required}
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
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
        </Button>
      </form>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductForm;