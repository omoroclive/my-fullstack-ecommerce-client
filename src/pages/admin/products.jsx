import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Box,
  Typography,
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
  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(API_BASE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data);
        // Handle the response structure properly
        const productsData = response.data.products || response.data || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const deleteUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`;

      const response = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setSnackbarMessage(response.data.message || "Product deleted successfully!");
      setSnackbarSeverity("success");
    } catch (err) {
      setSnackbarMessage("Failed to delete product.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    return products.filter((product) => {
      if (!product || typeof product !== 'object') return false;
      
      const searchFields = [
        product.title || '',
        product.category || '',
        product.brand || ''
      ];
      
      return searchFields.some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

  // Helper function to render price with sale price handling
  const renderPrice = (product) => {
    if (!product || typeof product.price === 'undefined') {
      return <Typography variant="body2" className="text-gray-500">Price not available</Typography>;
    }
    
    const hasValidSalePrice = product.salePrice && product.salePrice > 0;
    
    if (hasValidSalePrice) {
      return (
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="text-red-600 font-bold">
            ${product.salePrice}
          </Typography>
          <Typography variant="body2" className="text-gray-500 line-through">
            ${product.price}
          </Typography>
          <Chip 
            label="SALE" 
            size="small" 
            color="error" 
            variant="outlined"
          />
        </Box>
      );
    }
    
    return (
      <Typography variant="body2" className="text-black font-bold">
        ${product.price}
      </Typography>
    );
  };

  // Helper function to get stock status
  const getStockStatus = (totalStock) => {
    if (typeof totalStock !== 'number') return { label: "Stock Unknown", color: "default" };
    if (totalStock === 0) return { label: "Out of Stock", color: "error" };
    if (totalStock <= 5) return { label: "Low Stock", color: "warning" };
    return { label: "In Stock", color: "success" };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Products ({filteredProducts.length})
      </h1>

      <TextField
        label="Search Products"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by title, category, or brand"
        className="mb-4"
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      ) : (
        <>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.totalStock);
                
                return (
                  <div
                    key={product._id}
                    className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.title}
                        className="w-full h-64 object-cover rounded mb-4"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      {product.salePrice > 0 && (
                        <div className="absolute top-2 left-2">
                          <Chip 
                            label="SALE" 
                            size="small" 
                            color="error"
                            className="bg-red-500 text-white"
                          />
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                        {product.title || 'Untitled Product'}
                      </h2>
                      
                      <div className="flex justify-center gap-2 mb-2">
                        <Chip 
                          label={product.category || 'No Category'} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={product.brand || 'No Brand'} 
                          size="small" 
                          variant="outlined"
                        />
                      </div>

                      <div className="flex justify-center">
                        {renderPrice(product)}
                      </div>

                      <div className="flex justify-center">
                        <Chip 
                          label={`${stockStatus.label} (${product.totalStock || 0})`}
                          size="small"
                          color={stockStatus.color}
                          variant="outlined"
                        />
                      </div>

                      {product.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between mt-4">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/admin/dashboard/edit-product/${product._id}`)}
                        title="Edit Product"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                        title="Delete Product"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? "No products found matching your search." : "No products available."}
              </p>
            </div>
          )}
        </>
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