import React, { useState } from "react";
import {
  Box,
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
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        Array.from(formData.images).forEach((file) => {
          formDataToSubmit.append("images", file);
        });
      } else {
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
          },
        }
      );
      setNotification({
        open: true,
        message: "Product added successfully!",
        severity: "success",
      });
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
      setNotification({
        open: true,
        message: "Failed to add product. Please try again.",
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
                />
              );
            case "select":
              return (
                <FormControl fullWidth variant="outlined" key={field.name}>
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
                >
                  {field.label}
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
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#00008b",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#45a049",
            },
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
