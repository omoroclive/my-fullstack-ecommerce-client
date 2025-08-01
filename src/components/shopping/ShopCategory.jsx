import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography, Button } from "@mui/material";
import RecentlySearched from "../../pages/account/RecentlySearched";
import Footer from "../Footer";

const ShopCategory = () => {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // URLs to try
  const localURL = "http://localhost:3000";
  const productionURL = "https://ecommerce-server-c6w5.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        let queryParams = [];
        if (category) queryParams.push(`category=${encodeURIComponent(category)}`);

        const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
        const endpoint = `/api/products${queryString}`;

        // Try production URL first, then fallback to local if that fails
        try {
          const response = await axios.get(`${productionURL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000 // 5 second timeout
          });
          
          setProducts(response.data.products || []);
          console.log("Successfully connected to production API");
        } catch (prodError) {
          console.log("Failed to connect to production API, trying local...", prodError);
          
          // Try local URL as fallback
          const response = await axios.get(`${localURL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setProducts(response.data.products || []);
          console.log("Successfully connected to local API");
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError(error.response?.data?.message || "Failed to fetch products from both APIs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const pageTitle = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : "All Products";

  return (
    <div className="p-1">
      {/* */}
      <div className="bg-gray-200 p-4 w-full " style={{ position: "absolute", left: "calc(-50vw + 50%)" }}>
        <Typography variant="h4" className="font-bold text-center">
          {pageTitle}
        </Typography>
      </div>

      {/* */}
      <div className="mt-28">
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <Typography variant="body1" className="text-center">
            No products found for {category}. Please check the category name.
          </Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer"
                onClick={() => navigate(`/shop/details/${product._id}`)}
              >
                <img
                  src={product.images[0]?.url || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-48 object-contain rounded-t-lg"
                />
                <div className="p-4">
                  <Typography variant="h6" className="font-semibold">
                    {product.title}
                  </Typography>
                  <Typography variant="body1" className="text-black font-bold">
                    Ksh {product.price}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Shopping Button */}
      <div className="text-center mt-6">
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: "orange" }}
          onClick={() => navigate("/shop/shopping")}
        >
          Back to Shopping
        </Button>
      </div>
      <RecentlySearched />
      <Footer />
    </div>
  );
};

export default ShopCategory;