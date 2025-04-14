import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, IconButton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useNavigate } from "react-router-dom";
import FilterDrawer from "./FilterDrawer";
import ProductGrid from "./ProductGrid";
import RecentlyViewed from "../../pages/account/RecentlyViewed";



  // Fetch products from backend
  const API_URL = "http://localhost:3000" || "https://grateful-adventure-production.up.railway.app";

const Shopping = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filtering and sorting
  useEffect(() => {
    let updatedProducts = products;

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    updatedProducts = updatedProducts.sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredProducts(updatedProducts);
  }, [products, selectedCategory, searchTerm, sortOption]);

  // Toggle filter drawer
  const toggleFilterDrawer = () => setIsFilterOpen(!isFilterOpen);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">Shop Products</h1>
        <IconButton onClick={toggleFilterDrawer}>
          <TuneIcon />
        </IconButton>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        toggleDrawer={toggleFilterDrawer}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Product Grid */}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ProductGrid products={filteredProducts} navigate={navigate} />
      )}

      {/* No Products Found */}
      {!isLoading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-600 mt-6">
          No products found. Try a different search or filter.
        </p>
      )}
      <RecentlyViewed />
    </div>
  );
};

export default Shopping;


