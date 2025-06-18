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
    images: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(true);

  const { productId } = useParams();
  const navigate = useNavigate();

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
          `http://localhost:3000/api/products/${productId}` 
          || `https://ecommerce-server-c6w5.onrender.com/api/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const productData = response.data.product;

        // Ensure all required fields are properly initialized
        setFormData({
          title: productData.title || "",
          description: productData.description || "",
          category: productData.category || "",
          brand: productData.brand || "",
          price: productData.price || "",
          salePrice: productData.salePrice || "",
          totalStock: productData.totalStock || "",
          images: productData.images || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        setSnackbarMessage(
          error.response?.data?.message || "Error fetching product"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);

        // Redirect to login if unauthorized
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
      // Create FormData and log each field for debugging
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("salePrice", formData.salePrice || "0");
      formDataToSend.append("totalStock", formData.totalStock);
  
      // Handle existing images
      if (Array.isArray(formData.images)) {
        formDataToSend.append("existingImages", JSON.stringify(formData.images));
      }
  
      // Log the data being sent
      console.log("Sending form data:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }
  
      const response = await axios.put(
        `http://localhost:3000/api/products/${productId}` 
        || `https://ecommerce-server-c6w5.onrender.com/api/products/${productId}`,
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
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.title}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    error={!formData.description}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.category}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.brand}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.price}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sale Price"
                    name="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Total Stock"
                    name="totalStock"
                    type="number"
                    value={formData.totalStock}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.totalStock}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    Current Images
                  </Typography>
                  <div className="flex gap-2 mb-4">
                    {formData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
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

              <CardActions
                style={{ justifyContent: "center", marginTop: "1rem" }}
              >
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
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default EditProductPage;
