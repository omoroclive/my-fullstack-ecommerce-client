import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography, Button } from "@mui/material";

const Shop = () => {
  const { brand } = useParams(); // Get brand from URL
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get(`http://localhost:3000/api/products?brand=${brand}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debugging

        setProducts(response.data.products);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByBrand();
  }, [brand]);

  return (
    <div className="p-4">
      <Typography variant="h4" className="font-bold text-center mb-4">
        {brand.charAt(0).toUpperCase() + brand.slice(1)} Products
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <Typography variant="body1" className="text-center">
          No products found for {brand}.
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
    </div>
  );
};

export default Shop;
