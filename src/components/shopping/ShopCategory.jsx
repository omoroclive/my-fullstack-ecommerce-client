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

        const response = await axios.get(`http://localhost:3000/api/products${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data.products || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const pageTitle = category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : "All Products";

  return (
    <div className="p-1">
      {/* Title Section with Gray Background and Relative Positioning */}
      <div className="bg-gray-200 p-4 w-full " style={{ position: "absolute", left: "calc(-50vw + 50%)" }}>
        <Typography variant="h4" className="font-bold text-center">
          {pageTitle}
        </Typography>
      </div>

      {/* Margin between title and product container */}
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
                    ${product.price}
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

