import React, { useEffect, useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          "https://ecommerce-server-c6w5.onrender.com/api/products",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setProducts(response.data.products || []);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Fetch cancelled");
        } else {
          setError(error.response?.data?.message || "Failed to fetch products");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://ecommerce-server-c6w5.onrender.com/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setSnackbarMessage(response.data.message || "Product deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to delete product.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const category = product.category?.toLowerCase() || "";
      const brand = product.brand?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return title.includes(search) || category.includes(search) || brand.includes(search);
    });
  }, [products, searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>

      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, category, or brand"
      />

      {isLoading ? (
        <div className="flex justify-center mt-6">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <img
                src={
                  Array.isArray(product.images) &&
                  product.images.length > 0 &&
                  product.images[0].url
                    ? product.images[0].url
                    : "/placeholder.png"
                }
                alt={product.title || "Product Image"}
                className="w-full h-64 object-cover rounded mb-4"
              />

              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {product.title || "Untitled"}
                </h2>
                <p className="text-gray-600">
                  <strong>Category:</strong> {product.category || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Brand:</strong> {product.brand || "N/A"}
                </p>
                <p className="text-black font-bold">
                  <strong>Price:</strong> ${product.price || "0.00"}
                </p>
              </div>

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

      {!isLoading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-600 mt-4">
          No products found. Try a different search.
        </p>
      )}

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
