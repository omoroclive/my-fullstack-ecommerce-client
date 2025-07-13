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
import RecentlyViewed from "../../pages/account/RecentlyViewed";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewUsers, setReviewUsers] = useState({});
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
  const placeholderImage = "https://via.placeholder.com/300";

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
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

  //  Simplified: Fetch only the reviews (user is already populated)
  useEffect(() => {
    const fetchReviews = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;
      try {
        const reviewsResponse = await axios.get(`${API_BASE_URL}/api/reviews/simple/${id}`);


        // Debugging logs
        console.log("Full API response:", reviewsResponse);
        console.log("Reviews data:", reviewsResponse.data?.reviews);

        const reviewsData = reviewsResponse.data?.reviews || [];

        console.log("Number of reviews found:", reviewsData.length);
        setReviews(reviewsData);

        // Calculate average rating
        const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(reviewsData.length ? total / reviewsData.length : 0);

      } catch (err) {
        console.error("Review fetch error:", err);
        console.error("Error response:", err.response?.data);
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
    dispatch(addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      image: product.images[0]?.url || placeholderImage
    }));
    setSnackbar({ open: true, message: "Added to cart!", severity: "success" });
  };

  const handleAddToWishlist = () => {
    dispatch(
      addToSavedItems({
        _id: product._id,
        title: product.title,
        image: mainImage,
        price: product.price,
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
    window.location.href = "tel:+254791150726";
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (isLoading) return <CircularProgress color="warning" />;
  if (error)
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );

  return (
    <Box className="p-6">
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" className="mb-4">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="/shop">
          Shop
        </Link>
        <Typography color="text.primary">{product?.title}</Typography>
      </Breadcrumbs>

      {/* Product Section */}
      <Paper elevation={3} className="p-6 rounded-lg">
        <Grid container spacing={6}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <img
              src={mainImage}
              alt={product?.title || "Product"}
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
            <Grid container spacing={2} className="mt-4">
              {product?.images?.map((image, index) => (
                <Grid item xs={4} sm={3} key={index}>
                  <img
                    src={image.url || placeholderImage}
                    alt={`Thumbnail ${index}`}
                    className="w-full h-20 object-cover border border-gray-200 rounded cursor-pointer"
                    onClick={() => setMainImage(image.url || placeholderImage)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom className="font-bold">
              {product?.title || "No title available"}
            </Typography>

            {/* Average Rating */}
            <Box className="flex items-center gap-2 mb-4">
              <Rating
                value={parseFloat(averageRating)}
                readOnly
                precision={0.1}
              />
              <Typography variant="body1">({averageRating} stars)</Typography>
            </Box>

            <Typography variant="h5" className="mb-4 font-bold text-orange-600">
              ${product?.price?.toFixed(2) || "N/A"}
            </Typography>
            <Typography variant="body1" className="mb-4 text-gray-600">
              {product?.description || "No description available"}
            </Typography>

            {/* Quantity Selector */}
            <Typography variant="body2" className="mb-2">
              Quantity:
            </Typography>
            <Box className="flex items-center gap-4 mb-4">
              <IconButton onClick={decrementQuantity}>
                <RemoveIcon />
              </IconButton>
              <Typography className="text-lg">{quantity}</Typography>
              <IconButton onClick={incrementQuantity}>
                <AddIcon />
              </IconButton>
            </Box>

            {/* Action Buttons */}
            <Box className="flex flex-col sm:flex-row md:justify-start items-stretch sm:items-center gap-4 mt-6">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ea580c",
                  "&:hover": { backgroundColor: "#c2410c" },
                  whiteSpace: "nowrap",
                  width: "100%", // Full width on mobile
                  sm: { width: "auto" },
                  md: { width: "200px" }, // Fixed width for medium screens
                }}
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderColor: "#ea580c",
                  color: "#ea580c",
                  "&:hover": {
                    borderColor: "#c2410c",
                    backgroundColor: "#c2410c",
                    color: "white",
                  },
                  whiteSpace: "nowrap",
                  width: "100%",
                  sm: { width: "auto" },
                  md: { width: "200px" }, // Fixed width for consistency
                }}
                startIcon={<FavoriteBorderIcon />}
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </Button>

              <Box className="flex justify-center md:justify-start gap-2">
                <IconButton className="text-orange-600 hover:text-orange-700" onClick={handleShare}>
                  <ShareIcon />
                </IconButton>

                <IconButton className="text-orange-600 hover:text-orange-700" onClick={handleCall}>
                  <PhoneIcon />
                </IconButton>

                <IconButton className="text-green-600 hover:text-green-700">
                  <WhatsAppIcon />
                </IconButton>
              </Box>
            </Box>

          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box className="mt-8">
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          className="border-b border-gray-300"
        >
          <Tab
            label="Product Info"
            className="hover:text-orange-500 hover:underline transition"
          />
          <Tab
            label="Delivery & Returns"
            className="hover:text-orange-500 hover:underline transition"
          />
          <Tab
            label="Reviews"
            className="hover:text-orange-500 hover:underline transition"
          />
        </Tabs>
        <Box className="p-4">
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
                <Typography variant="body1">
                  No reviews yet. Be the first to write one!
                </Typography>
              ) : (
                reviews.map((review) => (
                  <Box key={review._id} className="border-b border-gray-200 pb-4 mb-4">
                    <Typography variant="subtitle1" className="font-medium">
                      console.log("Review user:", review.user);
                      {review.user?.fullName || "Anonymous User"}
                    </Typography>
                    <Rating
                      value={review.rating || 0}
                      readOnly
                      size="small"
                      precision={0.5}
                    />
                    <Typography variant="body2" color="textSecondary" className="mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" className="mt-2">
                      {review.comment}
                    </Typography>
                  </Box>
                ))
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Details;