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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

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
      <Box className="text-center mt-8">
        <ShoppingCartIcon sx={{ fontSize: 60, color: "gray" }} />
        <Typography variant="h5" className="mt-4">
          Your cart is empty
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="p-8">
      {/* Cart Title with Background */}
      <Box
        sx={{
          backgroundColor: "#F3F4F6", // Light gray background
          padding: "16px",
          textAlign: "center",
          borderRadius: "8px",
          marginBottom: "48px",
          width: "100vw",
          position: "relative",
          left: "calc(-50vw + 50%)", 
        }}
      >
        <Typography
          variant="h4"
          className="font-bold"
          sx={{
            textTransform: "uppercase",
            color: "#1F2937", 
            
          }}
        >
          Shopping Cart
        </Typography>

        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            justifyContent: "center",
            display: "flex",
            marginTop: "8px",
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/shop/home")}
            sx={{
              cursor: "pointer",
              fontSize: "14px",
              "&:hover": { color: "orange" }, // Dark blue on hover
            }}
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/shop/products")}
            sx={{
              cursor: "pointer",
              fontSize: "14px",
              "&:hover": { color: "orange" },
            }}
          >
            Shop
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            Cart
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Cart Items */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          {cart.items.map((item) => (
            <Grid
              item
              xs={12}
              key={item.id}
              className="border rounded p-4 flex justify-between"
            >
              <Box className="flex items-center gap-4">
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" className="text-gray-500">
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box className="flex items-center gap-4 p-4">
                <TextField
                  type="number"
                  size="small"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.id, parseInt(e.target.value))
                  }
                  inputProps={{ min: 1 }}
                  sx={{ width: 80 }}
                />
                <Typography variant="body2" className="text-gray-500">
                  Total: ${item.totalPrice.toFixed(2)}
                </Typography>
                <IconButton color="error" onClick={() => handleRemove(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Divider */}
      <Divider className="my-4" />

      {/* Cart Total and Buttons */}
      <Box className="flex justify-between items-center mt-4">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total: ${cart.totalAmount.toFixed(2)}
        </Typography>
        <Box className="flex gap-4">
          <Button variant="contained" color="error" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black", 
              "&:hover": {
                backgroundColor: "#3749A1", // Lighter shade on hover
              },
              color: "white",
            }}
            onClick={() => navigate("/shop/checkout")} // Navigates to the checkout page
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
