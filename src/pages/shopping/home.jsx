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
  CardContent
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Components
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

// Data configuration
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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setFeaturedProducts(data.products.slice(0, 6));
    } catch (error) {
      setError(error.message);
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
    <div className="cursor-pointer relative" onClick={onClick}>
      <img
        src={src}
        alt={alt}
        className="w-24 h-24 object-contain rounded-full"
        style={{ backgroundColor: 'white' }}
      />
      <IconButton
        sx={{
          position: "absolute",
          bottom: "-30px",
          right: "15px",
          color: "black",
          transition: "color 0.3s ease",
          "&:hover": { color: "orange" },
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );

  const ProductCard = ({ product }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 3 }
      }}
      onClick={() => navigate(`/shop/details/${product._id}`)}
    >
      <img
        src={product.images[0]?.url || "/placeholder.png"}
        alt={product.title}
        className="w-full h-48 object-contain rounded-t-lg"
      />
      <CardContent>
        <Typography variant="h6" className="font-semibold">
          {product.title}
        </Typography>
        <Typography variant="body1" className="text-black font-bold">
          <p className="text-gray-600">
            <strong>Price:</strong> ${product.price}
          </p>
        </Typography>
        <p className="text-gray-600">
          <strong>Category:</strong> {product.category}
        </p>
        <p className="text-gray-600">
          <strong>Brand:</strong> {product.brand}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">

      {/* Top Brands Section */}

      <section className="mt-8 text-center bg-gray-100 p-6 rounded-lg">
        <Typography variant="h4" className="font-bold mb-8">
          Top Brands
        </Typography>
        <div className="flex justify-between items-center gap-4">
          {BRANDS.map(({ logo, brand }) => (
            <ImageWithArrow
              key={brand}
              src={logo}
              alt={brand}
              onClick={() => handleBrandClick(brand)}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mt-8">
        <Typography variant="h4" className="font-bold text-center mb-4">
          Featured Products
        </Typography>

        {isLoading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error" className="text-center">
            {error}
          </Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
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
            View All Products
          </Button>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="mt-8 text-center bg-gray-100 p-6 rounded-lg">
        <Typography variant="h4" className="font-bold mb-8">
          Top Categories
        </Typography>
        <div className="flex justify-between items-center gap-4">
          {CATEGORIES.map(({ logo, category }) => (
            <ImageWithArrow
              key={category}
              src={logo}
              alt={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </section>

      {/* Promotional Section */}
      <section className="mt-12 bg-blue-100 p-6 rounded-lg">
        <Typography variant="h5" className="font-bold mb-4">
          Exclusive Deals
        </Typography>
        <Typography variant="body1" className="text-gray-700">
          Don't miss out on our exclusive offers and discounts!
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

      <Chatbot />
      <Footer />
    </div>
  );
};

export default Home;
