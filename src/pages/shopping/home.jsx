import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBrandFilter, setCategoryFilter } from "../../store/filter/filterSlice";
import {
  CircularProgress,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Grid
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Chatbot from "./Chatbot";
import Footer from "../../components/Footer";

// Brand Images
import pumaIcon from "../../assets/images/puma1.png";
import nikeLogo from "../../assets/images/nike9.png";
import adidasLogo from "../../assets/images/adidasBrand.jpg";
import zaraLogo from "../../assets/images/zaraBrand.jpeg";

// Category Images
import menCategoryLogo from "../../assets/images/menCategory.png";
import womenCategoryLogo from "../../assets/images/womenCategory.png";
import kidsCategoryLogo from "../../assets/images/kidsCategory.png";
import footwearCategoryLogo from "../../assets/images/footwearCategory.png";
import accessoriesCategoryLogo from "../../assets/images/accessoriesCategory1.png";

const BRANDS = [
  { logo: pumaIcon, brand: "puma" },
  { logo: nikeLogo, brand: "nike" },
  { logo: adidasLogo, brand: "adidas" },
  { logo: zaraLogo, brand: "zara" }
];

const CATEGORIES = [
  { logo: menCategoryLogo, category: "Men" },
  { logo: womenCategoryLogo, category: "Women" },
  { logo: kidsCategoryLogo, category: "Kids" },
  { logo: footwearCategoryLogo, category: "Footwear" },
  { logo: accessoriesCategoryLogo, category: "Accessories" }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setFeaturedProducts(data.products.slice(0, 6));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleBrandClick = (brand) => {
    dispatch(setBrandFilter(brand));
    navigate(`/shop/brands/${brand}`);
  };

  const handleCategoryClick = (category) => {
    dispatch(setCategoryFilter(category));
    navigate(`/shop/categories/${category}`);
  };

  const ImageWithArrow = ({ src, alt, onClick }) => (
    <Card
      sx={{
        width: 120,
        textAlign: "center",
        position: "relative",
        p: 1,
        borderRadius: 3,
        boxShadow: 1,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 4,
        },
        backgroundColor: "#fff"
      }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: 80, objectFit: "contain" }}
      />
      <IconButton
        sx={{
          position: "absolute",
          bottom: -15,
          right: 10,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          "&:hover": { backgroundColor: "orange", color: "#fff" },
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </Card>
  );

  const ProductCard = ({ product }) => (
    <Card
      sx={{
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-5px)",
        },
        cursor: "pointer",
      }}
      onClick={() => navigate(`/shop/details/${product._id}`)}
    >
      <CardActionArea>
        <img
          src={product.images[0]?.url || "/placeholder.png"}
          alt={product.title}
          style={{ width: "100%", height: 200, objectFit: "contain" }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Price:</strong> ${product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Category:</strong> {product.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Brand:</strong> {product.brand}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      {/* Top Brands */}
      <Box sx={{ backgroundColor: "#f9f9f9", borderRadius: 3, p: 4, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Top Brands
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {BRANDS.map(({ logo, brand }) => (
            <Grid item key={brand}>
              <ImageWithArrow src={logo} alt={brand} onClick={() => handleBrandClick(brand)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Featured Products
        </Typography>
        {isLoading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "orange",
              "&:hover": { backgroundColor: "#e68a00" },
            }}
            onClick={() => navigate("/shop/shopping")}
          >
            View All Products
          </Button>
        </Box>
      </Box>

      {/* Top Categories */}
      <Box sx={{ backgroundColor: "#f9f9f9", borderRadius: 3, p: 4, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={3}>
          Top Categories
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {CATEGORIES.map(({ logo, category }) => (
            <Grid item key={category}>
              <ImageWithArrow src={logo} alt={category} onClick={() => handleCategoryClick(category)} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Promotional Banner */}
      <Box
        sx={{
          backgroundColor: "#e3f2fd",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          mb: 6,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Exclusive Deals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Don’t miss out on our exclusive offers and discounts!
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "orange",
            "&:hover": { backgroundColor: "#e68a00" },
          }}
          onClick={() => navigate("/shop/shopping")}
        >
          Shop Now
        </Button>
      </Box>

      <Chatbot />
      <Footer />
    </Box>
  );
};

export default Home;
