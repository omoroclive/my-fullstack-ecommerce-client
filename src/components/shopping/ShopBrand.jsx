import React, { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CircularProgress, 
  Typography, 
  Button, 
  Container,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Alert,
  Fade,
  Skeleton
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Footer from "../Footer";
import RecentlySearched from "../../pages/account/RecentlySearched";

const ShopBrand = () => {
  const { brand } = useParams();
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
        if (brand) queryParams.push(`brand=${encodeURIComponent(brand)}`);

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
  }, [brand]);

  const pageTitle = brand ? `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products` : "All Products";

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ borderRadius: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={200} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Enhanced Header Section */}
      <Paper
        sx={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          py: 8,
          mb: 6,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, rgba(234, 88, 12, 0.1) 0%, transparent 100%)",
            pointerEvents: "none",
          }
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={800}>
            <Stack direction="column" alignItems="center" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <StorefrontIcon sx={{ fontSize: 40 }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: 2
                  }}
                >
                  {pageTitle}
                </Typography>
              </Stack>
              
              {brand && (
                <Chip 
                  label={`Shop ${brand}`}
                  sx={{
                    backgroundColor: "#ea580c",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1rem",
                    px: 2,
                    py: 0.5
                  }}
                />
              )}
              
              {!isLoading && !error && products.length > 0 && (
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 400
                  }}
                >
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </Typography>
              )}
            </Stack>
          </Fade>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/shop/shopping")}
            sx={{
              borderColor: "#ea580c",
              color: "#ea580c",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#ea580c",
                color: "white",
                borderColor: "#ea580c",
              },
            }}
          >
            Back to Shopping
          </Button>
        </Box>

        {/* Content Section */}
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
            <CircularProgress 
              size={60} 
              sx={{ 
                color: "#ea580c", 
                mb: 3
              }} 
            />
            <Typography variant="h6" sx={{ color: "#64748b", mb: 4 }}>
              Loading {brand ? brand : 'all'} products...
            </Typography>
            <LoadingSkeleton />
          </Box>
        ) : error ? (
          <Fade in={true}>
            <Card
              sx={{
                p: 6,
                textAlign: "center",
                background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                border: "1px solid #fecaca",
                borderRadius: 4
              }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: "transparent",
                  border: "none"
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Oops! Something went wrong
                </Typography>
              </Alert>
              <Typography variant="body1" sx={{ color: "#dc2626", mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  backgroundColor: "#dc2626",
                  "&:hover": { backgroundColor: "#b91c1c" }
                }}
              >
                Try Again
              </Button>
            </Card>
          </Fade>
        ) : products.length === 0 ? (
          <Fade in={true}>
            <Card
              sx={{
                p: 8,
                textAlign: "center",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                border: "1px solid #bae6fd",
                borderRadius: 4
              }}
            >
              <ShoppingBagIcon 
                sx={{ 
                  fontSize: 80, 
                  color: "#0284c7", 
                  mb: 3,
                  opacity: 0.7
                }} 
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#0c4a6e" }}>
                No products found
              </Typography>
              <Typography variant="body1" sx={{ color: "#0369a1", mb: 4 }}>
                {brand ? `We couldn't find any products for "${brand}". Try checking the spelling or browse our other categories.` : "No products available at the moment."}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/shop/shopping")}
                sx={{
                  backgroundColor: "#0284c7",
                  "&:hover": { backgroundColor: "#0369a1" }
                }}
              >
                Browse All Products
              </Button>
            </Card>
          </Fade>
        ) : (
          <Fade in={true} timeout={600}>
            <Grid container spacing={4}>
              {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <Fade in={true} timeout={800 + index * 100}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        border: "1px solid #f1f5f9",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                          "& .product-image": {
                            transform: "scale(1.05)"
                          }
                        }
                      }}
                      onClick={() => navigate(`/shop/details/${product._id}`)}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={product.images[0]?.url || "/placeholder.png"}
                          alt={product.title}
                          className="product-image"
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            backgroundColor: "#f8fafc"
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                            backdropFilter: "blur(10px)"
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#ea580c",
                              fontSize: "0.8rem"
                            }}
                          >
                            {brand || "Product"}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1e293b",
                            mb: 2,
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical"
                          }}
                        >
                          {product.title}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: "#ea580c",
                              fontSize: "1.25rem"
                            }}
                          >
                            Ksh {product.price.toLocaleString()}
                          </Typography>
                          
                          <Chip
                            label="View Details"
                            size="small"
                            sx={{
                              backgroundColor: "#f1f5f9",
                              color: "#64748b",
                              fontWeight: 500,
                              "&:hover": {
                                backgroundColor: "#ea580c",
                                color: "white"
                              }
                            }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Container>

      <RecentlySearched />
      <Footer />
    </Box>
  );
};

export default ShopBrand;