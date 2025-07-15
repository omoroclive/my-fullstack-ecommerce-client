import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Snackbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const EditProductPage = () => {
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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  const { productId } = useParams();
  const navigate = useNavigate();

  // Predefined options for colors and sizes
  const colorOptions = [
    "Red", "Blue", "Green", "Black", "White", "Yellow", 
    "Purple", "Orange", "Pink", "Gray", "Brown", "Multi"
  ];

  const sizeOptions = [
    "XS", "S", "M", "L", "XL", "XXL",
    "32", "34", "36", "38", "40", "42", "44", "One Size"
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("Unauthorized. Please log in.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://ecommerce-server-c6w5.onrender.com/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const productData = response.data.product;

        setFormData({
          title: productData.title || "",
          description: productData.description || "",
          category: productData.category || "",
          brand: productData.brand || "",
          price: productData.price || "",
          salePrice: productData.salePrice || "",
          totalStock: productData.totalStock || "",
          color: productData.color || "",
          size: productData.size || "",
          images: productData.images || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        setSnackbarMessage(
          error.response?.data?.message || "Error fetching product"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      
      // Add all fields
      Object.keys(formData).forEach(key => {
        if (key === "images" && Array.isArray(formData.images)) {
          // Handle existing images
          formDataToSend.append("existingImages", JSON.stringify(formData.images));
        } else if (key === "images" && formData.images instanceof FileList) {
          // Handle new image uploads
          Array.from(formData.images).forEach(file => {
            formDataToSend.append("images", file);
          });
        } else if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `https://ecommerce-server-c6w5.onrender.com/api/products/${productId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
  
      setSnackbarMessage("Product updated successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => navigate("/admin/products"), 1500);
      
    } catch (error) {
      console.error("Update error:", error);
      setSnackbarMessage(error.response?.data?.message || "Error updating product");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" style={{ marginTop: "2rem" }}>
        Loading...
      </Typography>
    );
  }

  return (
    <Grid container justifyContent="center" style={{ padding: "2rem" }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Edit Product
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Existing fields... */}

                {/* Color Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Color (Optional)</InputLabel>
                    <Select
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      label="Color (Optional)"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {colorOptions.map(color => (
                        <MenuItem key={color} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Size Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Size (Optional)</InputLabel>
                    <Select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      label="Size (Optional)"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {sizeOptions.map(size => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Existing fields... */}
                
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    Current Images
                  </Typography>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                    {formData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    ))}
                  </div>

                  <Typography variant="body1" gutterBottom>
                    Upload New Images
                  </Typography>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        images: e.target.files,
                      }))
                    }
                  />
                </Grid>
              </Grid>

              <CardActions style={{ justifyContent: "center", marginTop: "1rem" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ minWidth: "150px" }}
                >
                  Update Product
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default EditProductPage;