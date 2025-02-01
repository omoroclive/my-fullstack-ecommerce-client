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
} from "@mui/material";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cart/cartSlice";
import { addToRecentlyViewed } from "../../store/recentlyViewed/recentlyViewedSlice";
import { addToSavedItems } from "../../store/savedItems/savedItemsSlice";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
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
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProduct(response.data.product);
        setMainImage(response.data.product?.images?.[0]?.url || placeholderImage);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Add to Recently Viewed
  useEffect(() => {
    if (product) {
      dispatch(
        addToRecentlyViewed({
          id: product._id,
          title: product.title,
          image: product.images[0]?.url || placeholderImage,
          price: product.price,
        })
      );
    }
  }, [product, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddToBag = () => {
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        image: mainImage,
        price: product.price,
        quantity,
      })
    );
    setSnackbar({
      open: true,
      message: "Product added to cart!",
      severity: "success",
    });
  };

  const handleAddToWishlist = () => {
    dispatch(
      addToSavedItems({
        id: product._id,
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

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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

      {/* Top Section */}
      <Grid container spacing={6}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <img
            src={mainImage}
            alt={product?.title || "Product"}
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <Grid container spacing={2} className="mt-4">
            {product?.images?.map((image, index) => (
              <Grid item xs={3} key={index}>
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
          <Typography variant="h4" gutterBottom>
            {product?.title || "No title available"}
          </Typography>
          <Rating value={product?.rating || 0} readOnly className="mb-4" />
          <Typography variant="h5" className="mb-4 font-bold">
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

          {/* Buttons */}
          <Box className="flex gap-4">
            <Button
              variant="contained"
              color="warning"
              className="text-white flex items-center gap-2 px-6 py-2 rounded-md transition"
              onClick={handleAddToBag}
            >
              <ShoppingCartIcon />
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="warning"
              className="border-orange-500 text-orange-500 flex items-center gap-2 px-6 py-2 rounded-md transition hover:bg-orange-500 hover:text-white"
              onClick={handleAddToWishlist}
            >
              <FavoriteBorderIcon />
              Add to Wishlist
            </Button>
          </Box>

          {/* Share Icons */}
          <Box className="flex gap-4 mt-4">
            <IconButton color="warning">
              <ShareIcon />
            </IconButton>
            <IconButton color="primary">
              <WhatsAppIcon />
            </IconButton>
            <IconButton color="default">
              <PhoneIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box className="mt-8">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
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
            <Typography variant="body1">
              No reviews yet. Be the first to write one!
            </Typography>
          )}
        </Box>
      </Box>

      {/* Snackbar Notifications */}
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
    </Box>
  );
};

export default Details;

