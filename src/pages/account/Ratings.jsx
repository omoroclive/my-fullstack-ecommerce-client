import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Card, CardContent, CardMedia, TextField, Button, Rating, Box } from "@mui/material";

const Ratings = () => {
  const [deliveredProducts, setDeliveredProducts] = useState([]);
  const [reviews, setReviews] = useState({});
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3000" || "https://ecommerce-server-c6w5.onrender.com";

  useEffect(() => {
    const fetchDeliveredProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only orders that have orderStatus === "Delivered"
        const deliveredOrders = response.data.filter(order => order.orderStatus === "Delivered");

        // Extract products from delivered orders
        const deliveredProductsList = deliveredOrders.flatMap(order => order.products || []);

        setDeliveredProducts(deliveredProductsList);
      } catch (error) {
        setError("Failed to fetch delivered products.");
      }
    };

    fetchDeliveredProducts();
  }, []);

  const handleReviewSubmit = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { rating, comment } = reviews[productId] || {};

      if (!rating || !comment) return alert("Please add both a rating and a comment.");

      await axios.post(
        `${API_BASE_URL}/api/reviews`,
        { product: productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Review submitted successfully!");
      setReviews((prev) => ({ ...prev, [productId]: { rating: 0, comment: "" } }));
    } catch (error) {
      setError("Failed to submit review.");
    }
  };

  const handleChange = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" align="center" marginY={3}>
        Rate and Review Your Delivered Products
      </Typography>

      {deliveredProducts.length === 0 ? (
        <Typography>No delivered products found.</Typography>
      ) : (
        deliveredProducts.map((product) => (
          <Card key={product._id} sx={{ display: "flex", marginBottom: 2, padding: 2 }}>
            {/* Product Image */}
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, objectFit: "contain", marginRight: 2 }}
              image={product.image || "https://via.placeholder.com/120"} // Default image if missing
              alt={product.name || "Product Image"}
            />
            
            {/* Product Details */}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{product.name || "Unknown Product"}</Typography>
              <Typography variant="body1" color="text.secondary">
                Price: ${product.price ? product.price.toFixed(2) : "N/A"}
              </Typography>

              {/* Rating Input */}
              <Box marginY={2}>
                <Typography variant="subtitle1">Your Rating:</Typography>
                <Rating
                  value={reviews[product._id]?.rating || 0}
                  onChange={(e, newValue) => handleChange(product._id, "rating", newValue)}
                />
              </Box>

              {/* Review Text Field */}
              <TextField
                label="Write your review"
                fullWidth
                multiline
                rows={3}
                value={reviews[product._id]?.comment || ""}
                onChange={(e) => handleChange(product._id, "comment", e.target.value)}
                margin="normal"
              />

              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReviewSubmit(product._id)}
                disabled={!reviews[product._id]?.rating || !reviews[product._id]?.comment}
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


