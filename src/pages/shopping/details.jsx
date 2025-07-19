import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  Paper,
  Divider,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cart/cartSlice";
import { addToRecentlyViewed } from "../../store/recentlyViewed/recentlyViewedSlice";
import { addToSavedItems } from "../../store/savedItems/savedItemsSlice";
import Footer from "../../components/Footer";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const placeholderImage = "https://via.placeholder.com/300";

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(response.data.product);
        setMainImage(
          response.data.product?.images?.[0]?.url || placeholderImage
        );
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        const reviewsResponse = await axios.get(`${API_BASE_URL}/api/reviews/simple/${id}`);
        const reviewsData = reviewsResponse.data?.reviews || [];
        setReviews(reviewsData);

        const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(reviewsData.length ? total / reviewsData.length : 0);

      } catch (err) {
        console.error("Review fetch error:", err);
        setError(err.response?.data?.message || "Failed to load reviews");
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // Add to Recently Viewed
  useEffect(() => {
    if (product) {
      dispatch(
        addToRecentlyViewed({
          _id: product._id,
          title: product.title,
          image: product.images[0]?.url || placeholderImage,
          price: product.price,
        })
      );
    }
  }, [product, dispatch]);

  const handleAddToCart = () => {
  const cartItem = {
    _id: product._id,
    title: product.title,
    price: product.price,
    quantity: quantity,
    image: product.images[0]?.url || placeholderImage,
    description: product.description || "", // Include description
    ...(product.color && { color: product.color }), // Include color if it exists
    ...(product.size && { size: product.size }) // Include size if it exists
  };
  
  dispatch(addToCart(cartItem));
  setSnackbar({ open: true, message: "Added to cart!", severity: "success" });
};

  const handleAddToWishlist = () => {
    dispatch(
      addToSavedItems({
        _id: product._id,
        title: product.title,
        image: mainImage,
        price: product.price,
        color: product.color,
        size: product.size
      })
    );
    setSnackbar({
      open: true,
      message: "Product added to wishlist!",
      severity: "success",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        image: product?.images[0]?.url || placeholderImage,
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: "Link copied to clipboard!",
        severity: "success",
      });
    }
  };

  const handleCall = () => {
    window.location.href = "tel:+254727476868";
  };

  const handleWhatsApp = () => {
    const message = `Check out this product: ${product?.title} - Ksh ${product?.price}
     ${product?.images[0]?.url ? `\nImage: ${product.images[0].url}` : ""}\n\nLink: ${window.location.href}`;
    const url = `https://wa.me/+254727476868?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setSnackbar({
      open: true,
      message: "WhatsApp link opened!",
      severity: "success",
    });
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress color="warning" />
    </Box>
  );
  if (error) return (
    <Typography color="error" variant="h6" align="center" sx={{ mt: 4 }}>
      {error}
    </Typography>
  );

  return (
    <Box>
      <Box sx={{ px: isMobile ? 2 : 6, py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/shop">
            Shop
          </Link>
          <Typography color="text.primary">{product?.title}</Typography>
        </Breadcrumbs>

        {/* Product Section */}
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={mainImage}
                alt={product?.title || "Product"}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: isMobile ? 300 : 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2
                }}
              />
              <Grid container spacing={1} sx={{ mt: 2 }}>
                {product?.images?.map((image, index) => (
                  <Grid item xs={4} sm={3} key={index}>
                    <Box
                      component="img"
                      src={image.url || placeholderImage}
                      alt={`Thumbnail ${index}`}
                      loading="lazy"
                      sx={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main'
                        }
                      }}
                      onClick={() => setMainImage(image.url || placeholderImage)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product?.title || "No title available"}
              </Typography>

              {/* Average Rating */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating
                  value={parseFloat(averageRating)}
                  readOnly
                  precision={0.1}
                  size={isMobile ? "small" : "medium"}
                />
                <Typography variant="body1">
                  ({averageRating.toFixed(1)} stars)
                </Typography>
              </Box>

              {/* Price */}
              <Typography variant="h5" fontWeight="bold" color="orange.600" mb={3}>
                Ksh {product?.price?.toFixed(2) || "N/A"}
              </Typography>

              {/* Color and Size (if available) */}
              <Box display="flex" gap={2} mb={3}>
                {product?.color && (
                  <Chip 
                    label={`Color: ${product.color}`} 
                    variant="outlined" 
                    sx={{ 
                      borderColor: 'orange.500',
                      color: 'orange.800'
                    }} 
                  />
                )}
                {product?.size && (
                  <Chip 
                    label={`Size: ${product.size}`} 
                    variant="outlined" 
                    sx={{ 
                      borderColor: 'orange.500',
                      color: 'orange.800'
                    }} 
                  />
                )}
              </Box>

              <Typography variant="body1" color="text.secondary" mb={3}>
                {product?.description || "No description available"}
              </Typography>

              {/* Quantity Selector */}
              <Box mb={4}>
                <Typography variant="body2" mb={1}>
                  Quantity:
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton 
                    onClick={decrementQuantity}
                    size={isMobile ? "small" : "medium"}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="h6">{quantity}</Typography>
                  <IconButton 
                    onClick={incrementQuantity}
                    size={isMobile ? "small" : "medium"}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box 
                display="flex" 
                flexDirection={isMobile ? "column" : "row"} 
                gap={2}
                alignItems="stretch"
                mb={2}
              >
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  fullWidth={isMobile}
                  sx={{
                    whiteSpace: 'nowrap',
                    py: 1.5,
                    '&:hover': { bgcolor: 'orange.800' }
                  }}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<FavoriteBorderIcon />}
                  onClick={handleAddToWishlist}
                  fullWidth={isMobile}
                  sx={{
                    whiteSpace: 'nowrap',
                    py: 1.5,
                    borderWidth: 2,
                    '&:hover': { 
                      borderWidth: 2,
                      bgcolor: 'orange.800',
                      color: 'white'
                    }
                  }}
                >
                  Wishlist
                </Button>
              </Box>

              {/* Social Buttons */}
              <Box display="flex" gap={1} mt={isMobile ? 2 : 0}>
                <IconButton 
                  onClick={handleShare}
                  sx={{ color: 'orange.600', '&:hover': { color: 'orange.800' } }}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton 
                  onClick={handleCall}
                  sx={{ color: 'orange.600', '&:hover': { color: 'orange.800' } }}
                >
                  <PhoneIcon />
                </IconButton>
                <IconButton 
                  onClick={handleWhatsApp}
                  color="success"
                  sx={{ color: 'green.900', '&:hover': { color: 'green.800' } }}
                >
                  <WhatsAppIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Box sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 'unset',
                px: 2,
                mx: 1
              }
            }}
          >
            <Tab label="Details" />
            <Tab label="Shipping" />
            <Tab label={`Reviews (${reviews.length})`} />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {tabValue === 0 && (
              <Typography variant="body1">
                {product?.description || "No details available."}
              </Typography>
            )}
            {tabValue === 1 && (
              <Typography variant="body1">
                Free returns within 30 days. Standard delivery within 3-5 business
                days.
              </Typography>
            )}
            {tabValue === 2 && (
              <Box>
                {reviews.length === 0 ? (
                  <Typography variant="body1" textAlign="center" py={4}>
                    No reviews yet. Be the first to write one!
                  </Typography>
                ) : (
                  <Box>
                    {reviews.map((review) => {
                      const email = review.user?.email || "";
                      const nameFromEmail = email.split("@")[0];
                      const displayName =
                        review.user?.fullName ||
                        (nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)) ||
                        "Anonymous User";
                      const userAvatar =
                        review.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

                      return (
                        <Box
                          key={review._id}
                          sx={{
                            display: 'flex',
                            gap: 2,
                            py: 3,
                            borderBottom: 1,
                            borderColor: 'divider',
                            flexDirection: isMobile ? 'column' : 'row'
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar 
                              alt={displayName} 
                              src={userAvatar} 
                              sx={{ width: 56, height: 56 }} 
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {displayName}
                              </Typography>
                              <Rating
                                value={review.rating || 0}
                                readOnly
                                precision={0.5}
                                size={isMobile ? "small" : "medium"}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ ml: isMobile ? 0 : 2 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={1}
                            >
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="body1">
                              {review.comment}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ 
              width: '100%',
              bgcolor: 'orange.100',
              color: 'orange.800',
              '& .MuiAlert-icon': {
                color: 'orange.600'
              },
              '& .MuiAlert-action': {
                color: 'orange.600'
              }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Details;