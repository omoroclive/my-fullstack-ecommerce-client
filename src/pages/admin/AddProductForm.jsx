import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Stack,
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
    severity: "success",
  });

  // Predefined options for colors and sizes
  const colorOptions = [
    "Red", "Blue", "Green", "Black", "White", "Yellow", 
    "Purple", "Orange", "Pink", "Gray", "Brown"
  ];

  const sizeOptions = [
    "XS", "S", "M", "L", "XL", "XXL",
    "32", "34", "36", "38", "40", "42", "44"
  ];

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      setNotification({
        open: true,
        message: "No authentication token found",
        severity: "error",
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
        "http://localhost:3000/api/products" || "https://ecommerce-server-c6w5.onrender.com/api/products",
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setNotification({
        open: true,
        message: "Product added successfully!",
        severity: "success",
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          margin: "0 auto",
          padding: 3,
        }}
      >
        {addProductFormElements.map((field) => {
          switch (field.componentType) {
            case "input":
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
                  variant="outlined"
                  required={field.required}
                />
              );
            case "textarea":
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  required={field.required}
                />
              );
            case "select":
              return (
                <FormControl fullWidth variant="outlined" key={field.name} required={field.required}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    label={field.label}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            case "file":
              return (
                <Button
                  key={field.name}
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: 56 }}
                >
                  {formData.images.length > 0 
                    ? `${formData.images.length} file(s) selected`
                    : field.label}
                  <input
                    name={field.name}
                    type="file"
                    multiple
                    hidden
                    onChange={handleChange}
                  />
                </Button>
              );
            default:
              return null;
          }
        })}

        {/* Color Select Field */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Color (Optional)</InputLabel>
          <Select
            name="color"
            value={formData.color}
            onChange={handleChange}
            label="Color (Optional)"
            renderValue={(selected) => (
              selected ? <Chip label={selected} sx={{ backgroundColor: selected.toLowerCase() }} /> : ""
            )}
          >
            {colorOptions.map((color) => (
              <MenuItem key={color} value={color}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: color.toLowerCase(),
                      border: "1px solid #ccc",
                    }}
                  />
                  <span>{color}</span>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Size Select Field */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>Size (Optional)</InputLabel>
          <Select
            name="size"
            value={formData.size}
            onChange={handleChange}
            label="Size (Optional)"
          >
            {sizeOptions.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#00008b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#45a049",
            },
            height: 50,
            mt: 2,
          }}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
        </Button>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProductForm;