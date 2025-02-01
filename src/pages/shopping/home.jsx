import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Button, IconButton, Typography } from "@mui/material";
import pumaIcon from "../../assets/images/puma1.png";
import nikeLogo from "../../assets/images/nike9.png";
import adidasLogo from "../../assets/images/adidasBrand.jpg";
import zaraLogo from "../../assets/images/zaraBrand.jpeg";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch } from "react-redux";
import { setBrandFilter, setCategoryFilter } from "../../store/filter/filterSlice"; 

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get("http://localhost:3000/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeaturedProducts(response.data.products.slice(0, 6));
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Handle brand selection to update Redux store
  const handleBrandClick = (brand) => {
    dispatch(setBrandFilter(brand)); // Set brand filter in Redux store
    navigate(`/shop/${brand}`); // Navigate to filtered products page
  };

  // Handle category selection (you can create a category list similar to brands)
  const handleCategoryClick = (category) => {
    dispatch(setCategoryFilter(category)); // Set category filter in Redux store
    navigate(`/shop/${category}`); // Navigate to filtered products page
  };

  return (
    <div className="p-4">
      {/* Hero Slider */}

      {/* Top Brands Section */}
      <section className="mt-8 text-center bg-gray-100 p-6 rounded-lg">
        <Typography variant="h4" className="font-bold mb-8">
          Top Brands
        </Typography>
        <div className="flex justify-between items-center gap-4">
          {[{ logo: pumaIcon, brand: "puma" }, { logo: nikeLogo, brand: "nike" }, { logo: adidasLogo, brand: "adidas" }, { logo: zaraLogo, brand: "zara" }].map((item) => (
            <div
              key={item.brand}
              className="cursor-pointer relative"
              onClick={() => handleBrandClick(item.brand)} // Handle brand click
            >
              <img
                src={item.logo}
                alt={item.brand}
                className="w-24 h-24 object-contain rounded-full"
              />
              <IconButton
                color="default"
                sx={{
                  position: "absolute",
                  bottom: "-30px", // Move the arrow below the image
                  right: "15px",
                  color: "black",
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "orange",
                  },
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mt-8">
        <Typography variant="h4" className="font-bold text-center mb-4">
          Featured Products
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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

        {/* View All Products Button */}
        <div className="text-center mt-6">
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: "orange" }}
            onClick={() => navigate("/shop/shopping")}
          >
            View All Products
          </Button>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="mt-12 bg-blue-100 p-6 rounded-lg">
        <Typography variant="h5" className="font-bold mb-4">
          Exclusive Deals
        </Typography>
        <Typography variant="body1" className="text-gray-700">
          Don’t miss out on our exclusive offers and discounts!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/shop/shopping")}
          className="mt-4"
          style={{ backgroundColor: "orange" }}
        >
          Shop Now
        </Button>
      </section>
    </div>
  );
};

export default Home;
