import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../../store/cart/cartSlice";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  IconButton,
  TextField,
  Divider,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Container,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useNavigate } from "react-router-dom";
import Shipping from "./shipping";
import Footer from "../../components/Footer";

const Cart = () => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            border: "2px dashed #cbd5e1",
            borderRadius: 4,
          }}
        >
          <ShoppingBagIcon 
            sx={{ 
              fontSize: 80, 
              color: "#64748b", 
              mb: 3,
              opacity: 0.6 
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2, 
              color: "#334155",
              fontWeight: 600 
            }}
          >
            Your cart is empty
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: "#64748b",
              fontSize: "1.1rem" 
            }}
          >
            Looks like you haven't added anything to your cart yet
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/shop/shopping")}
            sx={{
              background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              boxShadow: "0 4px 15px rgba(234, 88, 12, 0.3)",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": { 
                background: "linear-gradient(135deg, #c2410c 0%, #9a3412 100%)",
                boxShadow: "0 6px 20px rgba(234, 88, 12, 0.4)",
              },
            }}
          >
            Start Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          You must be logged in to proceed to checkout.
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Enhanced Header */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            color: "white",
            borderRadius: 4,
            mb: 4,
            overflow: "hidden",
            position: "relative",
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
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={2}>
              <ShoppingCartIcon sx={{ fontSize: 32 }} />
              <Typography
                variant="h4"
                sx={{ 
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1
                }}
              >
                Shopping Cart
              </Typography>
            </Stack>
            <Chip 
              label={`${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'}`}
              sx={{
                backgroundColor: "#ea580c",
                color: "white",
                fontWeight: 600,
                mb: 2
              }}
            />
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                justifyContent: "center",
                display: "flex",
                flexWrap: "wrap",
                "& .MuiBreadcrumbs-separator": {
                  color: "rgba(255,255,255,0.7)"
                }
              }}
            >
              <Link
                underline="hover"
                color="rgba(255,255,255,0.9)"
                onClick={() => navigate("/shop/home")}
                sx={{ 
                  "&:hover": { color: "#ea580c" },
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Home
              </Link>
              <Link
                underline="hover"
                color="rgba(255,255,255,0.9)"
                onClick={() => navigate("/shop/shopping")}
                sx={{ 
                  "&:hover": { color: "#ea580c" },
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Shop
              </Link>
              <Typography color="white" fontWeight={600}>Cart</Typography>
            </Breadcrumbs>
          </CardContent>
        </Card>

        {/* Enhanced Cart Items */}
        <Stack spacing={3} mb={4}>
          {cart.items.map((item, index) => (
            <Card 
              key={item._id} 
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #f1f5f9",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  alignItems={{ xs: "stretch", md: "center" }}
                >
                  {/* Enhanced Product Info */}
                  <Stack 
                    direction="row" 
                    spacing={3} 
                    alignItems="center" 
                    sx={{ flex: 1 }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                    >
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.title}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#1e293b",
                          mb: 1,
                          lineHeight: 1.3
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: "#ea580c",
                          fontWeight: 600,
                          fontSize: "1.1rem"
                        }}
                      >
                        Ksh {item.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Enhanced Quantity Controls */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 2,
                      p: 2,
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      sx={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        "&:hover": { backgroundColor: "#f1f5f9" }
                      }}
                    >
                      <RemoveCircleOutlineIcon fontSize="small" />
                    </IconButton>
                    
                    <TextField
                      type="number"
                      size="small"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item._id, parseInt(e.target.value))
                      }
                      inputProps={{ min: 1, style: { textAlign: "center" } }}
                      sx={{ 
                        width: 80,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "white"
                        }
                      }}
                    />
                    
                    <IconButton
                      size="small"
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      sx={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        "&:hover": { backgroundColor: "#f1f5f9" }
                      }}
                    >
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {/* Enhanced Price and Delete */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ textAlign: "right", minWidth: 120 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", mb: 0.5 }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ 
                          fontWeight: 700,
                          color: "#1e293b"
                        }}
                      >
                        Ksh {item.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <IconButton
                      onClick={() => handleRemove(item._id)}
                      sx={{
                        color: "#dc2626",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        "&:hover": {
                          backgroundColor: "#fee2e2",
                          borderColor: "#fca5a5"
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

        {/* Enhanced Summary Section */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: 3,
            border: "1px solid #cbd5e1"
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={3}
            >
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ color: "#64748b", mb: 1 }}
                >
                  Cart Total
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: "#1e293b"
                  }}
                >
                  Ksh {cart.totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ minWidth: { sm: 300 } }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClearCart}
                  fullWidth
                  sx={{
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#dc2626",
                      color: "white",
                      borderColor: "#dc2626",
                    },
                  }}
                >
                  Clear Cart
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    if (!isAuthenticated) {
                      setOpenSnackbar(true);
                      setTimeout(() => navigate("/auth/login"), 1500);
                    } else {
                      navigate("/shop/checkout");
                    }
                  }}
                  sx={{
                    background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                    boxShadow: "0 4px 15px rgba(234, 88, 12, 0.3)",
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #c2410c 0%, #9a3412 100%)",
                      boxShadow: "0 6px 20px rgba(234, 88, 12, 0.4)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Enhanced Continue Shopping */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate("/shop/shopping")}
            sx={{
              borderColor: "#ea580c",
              color: "#ea580c",
              borderRadius: 2,
              px: 4,
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
            Continue Shopping
          </Button>
        </Box>

        <Shipping />
        <Footer />
      </Container>
    </>
  );
};

export default Cart;