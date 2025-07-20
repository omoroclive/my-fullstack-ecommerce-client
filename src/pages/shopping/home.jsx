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
  Box,
  Skeleton
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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

const LazyImage = ({ src, alt, className, style, onLoad, placeholder = true }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative overflow-hidden" style={style}>
      {loading && placeholder && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="absolute inset-0"
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.1)' }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ ...style, width: '100%', height: '100%', objectFit: 'contain' }}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          Image not found
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Refs for scrollable containers
  const brandScrollRef = React.useRef(null);
  const categoryScrollRef = React.useRef(null);

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

  // Scroll functions
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const ImageWithArrow = ({ src, alt, onClick }) => (
    <div className="cursor-pointer relative group transform hover:scale-105 transition-all duration-300 flex-shrink-0" onClick={onClick}>
      <div className="relative">
        <div className="w-32 h-32 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 border-2 border-gray-100 hover:border-orange-200">
          <LazyImage
            src={src}
            alt={alt}
            className="w-full h-full rounded-full"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <IconButton
          sx={{
            position: "absolute",
            bottom: "-8px",
            right: "8px",
            backgroundColor: "white",
            color: "black",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.3s ease",
            "&:hover": { 
              color: "orange", 
              backgroundColor: "white",
              transform: "scale(1.1)",
              boxShadow: "0 4px 12px rgba(255,165,0,0.3)"
            },
            width: "32px",
            height: "32px"
          }}
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </div>
      <Typography 
        variant="body2" 
        className="mt-3 font-medium text-gray-700 capitalize group-hover:text-orange-500 transition-colors duration-300 text-center"
      >
        {alt}
      </Typography>
    </div>
  );

  const ProductCard = ({ product }) => (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        '&:hover': { 
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px)'
        }
      }}
      onClick={() => navigate(`/shop/details/${product._id}`)}
    >
      <div className="relative overflow-hidden">
        <div className="h-64 bg-gray-50 flex items-center justify-center">
          <LazyImage
            src={product.images[0]?.url || "/placeholder.png"}
            alt={product.title}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.brand}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.title}
        </Typography>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Typography variant="h6" className="text-orange-600 font-bold">
              Ksh {product.price.toLocaleString()}
            </Typography>
          </div>
          <Typography variant="body2" className="text-gray-600 capitalize">
            {product.category}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white py-16 mb-8">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center px-4">
          <Typography variant="h2" className="font-bold mb-4 text-shadow">
            Welcome to Our Store
          </Typography>
          <Typography variant="h6" className="mb-6 opacity-90">
            Discover amazing products from top brands
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/shop/shopping")}
            sx={{
              backgroundColor: 'white',
              color: 'orange',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Start Shopping
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* Top Brands Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
              Top Brands
            </Typography>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Mobile: Horizontal scroll with arrows */}
            <div className="md:hidden">
              <div className="relative">
                <button 
                  onClick={() => scrollLeft(brandScrollRef)}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300"
                  style={{ marginLeft: '-16px' }}
                >
                  <ChevronLeftIcon className="text-gray-600" />
                </button>
                <div 
                  ref={brandScrollRef}
                  className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide px-4" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {BRANDS.map(({ logo, brand }) => (
                    <ImageWithArrow
                      key={brand}
                      src={logo}
                      alt={brand}
                      onClick={() => handleBrandClick(brand)}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => scrollRight(brandScrollRef)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300"
                  style={{ marginRight: '-16px' }}
                >
                  <ChevronRightIcon className="text-gray-600" />
                </button>
              </div>
            </div>
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-8 place-items-center">
              {BRANDS.map(({ logo, brand }) => (
                <ImageWithArrow
                  key={brand}
                  src={logo}
                  alt={brand}
                  onClick={() => handleBrandClick(brand)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
              Featured Products
            </Typography>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
            <Typography variant="body1" className="text-gray-600 mt-4">
              Handpicked items just for you
            </Typography>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} sx={{ borderRadius: '16px' }}>
                  <Skeleton variant="rectangular" height={256} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <Typography color="error" variant="h6" className="mb-4">
                {error}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                color="primary"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/shop/shopping")}
              sx={{
                backgroundColor: "orange",
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: "darkorange",
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255,165,0,0.4)'
                }
              }}
            >
              View All Products
            </Button>
          </div>
        </section>

        {/* Top Categories Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <Typography variant="h3" className="font-bold text-gray-800 mb-2">
              Shop by Category
            </Typography>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Mobile: Horizontal scroll with arrows */}
            <div className="md:hidden">
              <div className="relative">
                <button 
                  onClick={() => scrollLeft(categoryScrollRef)}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300"
                  style={{ marginLeft: '-16px' }}
                >
                  <ChevronLeftIcon className="text-gray-600" />
                </button>
                <div 
                  ref={categoryScrollRef}
                  className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide px-4" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {CATEGORIES.map(({ logo, category }) => (
                    <ImageWithArrow
                      key={category}
                      src={logo}
                      alt={category}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => scrollRight(categoryScrollRef)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-all duration-300"
                  style={{ marginRight: '-16px' }}
                >
                  <ChevronRightIcon className="text-gray-600" />
                </button>
              </div>
            </div>
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 place-items-center">
              {CATEGORIES.map(({ logo, category }) => (
                <ImageWithArrow
                  key={category}
                  src={logo}
                  alt={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Promotional Section */}
        <section className="mb-16">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 p-12 text-center text-white">
              <Typography variant="h3" className="font-bold mb-4">
                Exclusive Deals
              </Typography>
              <Typography variant="h6" className="mb-6 opacity-90">
                Don't miss out on our exclusive offers and discounts!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/shop/shopping")}
                sx={{
                  backgroundColor: "orange",
                  px: 4,
                  py: 1.5,
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: "darkorange",
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Chatbot />
      <Footer />
    </div>
  );
};

export default Home;