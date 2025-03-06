import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  IconButton,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import RecentlySearch from "../../pages/account/RecentlySearched";
import Footer from "../../components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token"); // Updated key
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:3000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(response.data.products);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Delete Product
  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token"); // Updated key
      const response = await axios.delete(
        `http://localhost:3000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product list and show success message
      setProducts(products.filter((product) => product._id !== productId));
      setSnackbarMessage(response.data.message || "Product deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      // Show error message
      setSnackbarMessage("Failed to delete product.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      {/* Search Bar */}
      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, category, or brand"
      />

      {/* Content */}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              {/* Product Image */}
              <img
                src={product.images[0]?.url || "/placeholder.png"}
                alt={product.title}
                className="w-full h-64 object-cover rounded mb-4" // Full width image with increased height
              />

              {/* Product Info */}
              <div className="text-center"> {/* Center align the title and price */}
                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600">
                  <strong>Category:</strong> {product.category}
                </p>
                <p className="text-gray-600">
                  <strong>Brand:</strong> {product.brand}
                </p>
                <p className="text-black font-bold"> {/* Price color changed to black */}
                  <strong>Price:</strong> ${product.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-4">
                <IconButton
                  color="primary"
                  onClick={() =>
                    navigate(`/admin/dashboard/edit-product/${product._id}`)
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(product._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Products Found */}
      {!isLoading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-600 mt-4">
          No products found. Try a different search.
        </p>
      )}

      {/* Snackbar for Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <RecentlySearch />
      <Footer />
    </div>
  );
};

export default Products;


