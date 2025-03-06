import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../store/cart/cartSlice";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Breadcrumbs,
  Link,
  Stack,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import Shipping from "./shipping";
import Footer from "../../components/Footer";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (cart.items.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <ShoppingCartIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
        <Typography variant="h5" className="text-center mb-4">
          Your cart is empty
        </Typography>
        <Button 
          variant="contained"
          onClick={() => navigate("/shop/products")}
          sx={{
            backgroundColor: '#ea580c',
            '&:hover': { backgroundColor: '#c2410c' }
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#F3F4F6",
          padding: { xs: "16px", md: "24px" },
          textAlign: "center",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <Typography
          variant="h5"
          className="font-bold mb-2"
          sx={{
            textTransform: "uppercase",
            color: "#1F2937",
          }}
        >
          Shopping Cart
        </Typography>

        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            fontSize: { xs: "12px", sm: "14px" },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/shop/home")}
            sx={{ "&:hover": { color: "#ea580c" } }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/shop/products")}
            sx={{ "&:hover": { color: "#ea580c" } }}
          >
            Shop
          </Link>
          <Typography color="text.primary">Cart</Typography>
        </Breadcrumbs>
      </Paper>

      {/* Cart Items */}
      <Stack spacing={3} mb={4}>
        {cart.items.map((item) => (
          <Paper
            key={item._id}
            elevation={1}
            className="p-3 md:p-4"
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              {/* Product Info */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                width={{ xs: "100%", sm: "auto" }}
              >
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <Box>
                  <Typography variant="subtitle1" className="font-medium">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              {/* Quantity and Actions */}
              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent={{ xs: "space-between", sm: "flex-end" }}
                width={{ xs: "100%", sm: "auto" }}
                mt={{ xs: 2, sm: 0 }}
              >
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item._id, parseInt(e.target.value))
                  }
                  inputProps={{ min: 1 }}
                  sx={{ width: { xs: 70, sm: 80 } }}
                />
                <Typography variant="body2" className="text-gray-500 min-w-[100px] text-right">
                  ${item.totalPrice.toFixed(2)}
                </Typography>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemove(item._id)}
                  sx={{ ml: { xs: 0, sm: 2 } }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Divider />

      {/* Cart Total and Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        className="mt-4"
      >
        <Typography variant="h6" className="font-bold text-center sm:text-left">
          Total: ${cart.totalAmount.toFixed(2)}
        </Typography>
        
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width={{ xs: "100%", sm: "auto" }}
        >
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleClearCart}
            fullWidth
            sx={{ 
              borderColor: '#dc2626',
              color: '#dc2626',
              '&:hover': {
                backgroundColor: '#dc2626',
                color: 'white'
              }
            }}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/shop/checkout")}
            sx={{
              backgroundColor: '#ea580c',
              '&:hover': {
                backgroundColor: '#c2410c',
              },
            }}
          >
            Checkout
          </Button>
        </Stack>
      </Stack>
      <Shipping />
      <Footer />
    </Box>
    
  );
};

export default Cart;