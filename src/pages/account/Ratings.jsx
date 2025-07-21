import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Rating,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const Ratings = () => {
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchDeliveredProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${API_BASE_URL}/api/orders/delivered`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Raw API response:", response.data); // Debug log

      // Transform the order data to properly include product details
      const productsWithOrder = response.data.orders.flatMap(order => 
        order.products.map(item => {
          console.log("Processing item:", item); // Debug log
          
          // Handle image from multiple possible sources
          let imageUrl = null;
          
          // Check if there's a populated product with images
          if (item.product && item.product.images && item.product.images.length > 0) {
            imageUrl = item.product.images[0];
          }
          // Check if there's a populated product with single image
          else if (item.product && item.product.image) {
            imageUrl = item.product.image;
          }
          // Check if the item itself has an image property
          else if (item.image) {
            imageUrl = item.image;
          }
          // Check if item has images array
          else if (item.images && item.images.length > 0) {
            imageUrl = item.images[0];
          }

          // Ensure the image URL is complete
          if (imageUrl && !imageUrl.startsWith('http')) {
            // If it's a relative path, prepend your base URL
            imageUrl = `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }

          console.log("Final image URL:", imageUrl); // Debug log

          return {
            // Use product details from populated data or fallback to item data
            _id: item.product?._id || item._id,
            name: item.product?.name || item.name,
            price: item.product?.price || item.price,
            description: item.product?.description || item.description,
            image: imageUrl,
            // Include order context
            orderId: order._id,
            // Keep original product reference for review submission
            productId: item.product?._id || item.product || item._id
          };
        })
      );

      console.log("Transformed products:", productsWithOrder); // Debug log
      setDeliveredProducts(productsWithOrder);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch delivered products"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveredProducts();
  }, [fetchDeliveredProducts]);

  const handleReviewChange = (productId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value }
    }));
  };

  const handleReviewSubmit = useCallback(async (productId) => {
    const token = getToken();
    const review = reviews[productId];

    if (!review?.rating || !review?.comment) {
      setAlert({ type: "error", message: "Please add both a rating and a comment" });
      return;
    }

    try {
      const orderItem = deliveredProducts.find(p => String(p._id) === String(productId));
      
      if (!orderItem) {
        setAlert({ 
          type: "error", 
          message: "Product not found in delivered products. Please refresh the page." 
        });
        return;
      }

      // Use the productId for the review (this should be the actual product ID)
      const actualProductId = orderItem.productId || orderItem._id;
      
      console.log('Order item ID:', productId);
      console.log('Actual product ID:', actualProductId);
      console.log('Order item details:', orderItem);

      const reviewData = {
        product: actualProductId,
        rating: review.rating,
        comment: review.comment,
        ...(orderItem?.orderId && { order: orderItem.orderId })
      };

      console.log('Review data being sent:', reviewData);

      const response = await axios.post(`${API_BASE_URL}/api/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Review submission successful:', response.data);

      setAlert({ type: "success", message: "Review submitted successfully!" });
      setReviews(prev => ({
        ...prev,
        [productId]: { rating: 0, comment: "" }
      }));
    } catch (error) {
      console.error('Review submission error:', error);
      
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to submit review"
      });
    }
  }, [reviews, deliveredProducts]);

  const handleCloseAlert = () => setAlert({ type: "", message: "" });

  // Handle image load errors
  const handleImageError = (event) => {
    console.log("Image failed to load:", event.target.src);
    event.target.src = "https://via.placeholder.com/120?text=No+Image";
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" marginY={3}>
        Rate Your Purchased Products
      </Typography>

      <Snackbar open={!!alert.message} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.type || "info"} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      {deliveredProducts.length === 0 ? (
        <Typography variant="body1" align="center">
          No delivered products available for review.
        </Typography>
      ) : (
        deliveredProducts.map(product => (
          <Card key={`${product._id}-${product.orderId}`} sx={{ display: "flex", mb: 3, p: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, objectFit: "contain", mr: 2 }}
              image={product.image || "https://via.placeholder.com/120?text=No+Image"}
              alt={product.name}
              onError={handleImageError}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${product.price?.toFixed(2) || "N/A"}
              </Typography>
              
              {/* Debug info - remove in production */}
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                Image URL: {product.image || "No image URL"}
              </Typography>

              <Box my={2}>
                <Typography variant="subtitle1">Your Rating:</Typography>
                <Rating
                  name={`rating-${product._id}`}
                  value={reviews[product._id]?.rating || 0}
                  onChange={(e, newValue) => handleReviewChange(product._id, "rating", newValue)}
                  precision={0.5}
                />
              </Box>

              <TextField
                label="Write your review"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={reviews[product._id]?.comment || ""}
                onChange={(e) => handleReviewChange(product._id, "comment", e.target.value)}
                margin="normal"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReviewSubmit(product._id)}
                disabled={!reviews[product._id]?.rating || !reviews[product._id]?.comment}
                sx={{ mt: 2 }}
              >
                Submit Review
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Ratings;