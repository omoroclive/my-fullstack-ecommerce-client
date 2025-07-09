import React, { useState, useEffect } from "react";
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

const Ratings = () => {
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDeliveredProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        
        const response = await axios.get(`${API_BASE_URL}/api/orders/delivered`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract products from delivered orders with order reference
        const productsWithOrder = response.data.flatMap(order => 
          (order.products || []).map(product => ({
            ...product,
            orderId: order._id // Include order ID for reference
          }))
        ); // Fixed the missing parenthesis here
        
        setDeliveredProducts(productsWithOrder);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch delivered products");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveredProducts();
  }, []);

  const handleReviewSubmit = async (productId) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      const review = reviews[productId];
      
      if (!review?.rating || !review?.comment) {
        setError("Please add both a rating and a comment");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/reviews`,
        { 
          product: productId, 
          rating: review.rating, 
          comment: review.comment,
          order: deliveredProducts.find(p => p._id === productId)?.orderId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Review submitted successfully!");
      // Clear the review for this product
      setReviews(prev => ({ ...prev, [productId]: { rating: 0, comment: "" } }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
    }
  };

  const handleChange = (productId, field, value) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
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
        Rate and Review Your Delivered Products
      </Typography>

      {/* Success/Error Alerts */}
      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert 
          onClose={handleCloseAlert} 
          severity={error ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      {deliveredProducts.length === 0 ? (
        <Typography variant="body1" align="center">
          {loading ? "Loading..." : "No delivered products found."}
        </Typography>
      ) : (
        deliveredProducts.map((product) => (
          <Card key={`${product._id}-${product.orderId}`} sx={{ display: "flex", mb: 3, p: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, objectFit: "contain", mr: 2 }}
              image={product.image || "https://via.placeholder.com/120"} 
              alt={product.name}
            />
            
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body1" color="text.secondary">
                Price: ${product.price?.toFixed(2) || "N/A"}
              </Typography>

              <Box my={2}>
                <Typography variant="subtitle1">Your Rating:</Typography>
                <Rating
                  name={`rating-${product._id}`}
                  value={reviews[product._id]?.rating || 0}
                  onChange={(e, newValue) => handleChange(product._id, "rating", newValue)}
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
                onChange={(e) => handleChange(product._id, "comment", e.target.value)}
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