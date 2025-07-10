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
  const [products, setProducts] = useState([]); // Changed from deliveredProducts
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Fetch products available for review
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");

      // Fetch both delivered and regular products
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/orders/delivered`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      // Combine products from orders with all products
      const orderedProducts = ordersResponse.data.flatMap(order =>
        (order.products || []).map(product => ({
          ...product,
          orderId: order._id,
          purchased: true
        }))
      );

      const allProducts = productsResponse.data.map(product => ({
        ...product,
        purchased: false
      }));

      // Merge and deduplicate products
      const mergedProducts = [...orderedProducts, ...allProducts].reduce((acc, product) => {
        if (!acc.some(p => p._id === product._id)) {
          acc.push(product);
        }
        return acc;
      }, []);

      setProducts(mergedProducts);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to fetch products"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      const product = products.find(p => String(p._id) === String(productId));

      await axios.post(`${API_BASE_URL}/api/reviews`, {
        product: productId,
        rating: review.rating,
        comment: review.comment,
        order: product?.orderId || null, // Now optional
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAlert({ type: "success", message: "Review submitted successfully!" });

      setReviews(prev => ({
        ...prev,
        [productId]: { rating: 0, comment: "" }
      }));
    } catch (error) {
      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to submit review"
      });
    }
  }, [reviews, products]);

  const handleCloseAlert = () => setAlert({ type: "", message: "" });

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
        Rate and Review Products
      </Typography>

      <Snackbar open={!!alert.message} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.type || "info"} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      {products.length === 0 ? (
        <Typography variant="body1" align="center">
          No products found.
        </Typography>
      ) : (
        products.map(product => (
          <Card key={`${product._id}-${product.orderId || 'no-order'}`} sx={{ display: "flex", mb: 3, p: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 120, height: 120, objectFit: "contain", mr: 2 }}
              image={product.image || "https://via.placeholder.com/120"}
              alt={product.name}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6">{product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${product.price?.toFixed(2) || "N/A"}
                {product.purchased && " • Purchased"}
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