import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/order/orderSlice";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Box,
  Chip,
  Divider
} from "@mui/material";
import { ShoppingBag as ShoppingBagIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userOrders, loadingUser, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "success";
      case "Shipped": return "primary";
      case "Processing": return "warning";
      case "Cancelled": return "error";
      case "Pending": return "default";
      default: return "info";
    }
  };

  if (loadingUser) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading your orders...</Typography>
    </Container>
  );

  if (error) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="error">{error}</Typography>
      <Button 
        variant="outlined" 
        onClick={() => dispatch(fetchUserOrders())}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Container>
  );

  if (userOrders.length === 0) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        You haven't placed any orders yet
      </Typography>
      <Button 
        variant="contained" 
        onClick={() => navigate('/shop')}
        startIcon={<ShoppingBagIcon />}
        sx={{ mt: 2 }}
      >
        Start Shopping
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Orders
      </Typography>
      
      <Grid container spacing={3}>
        {userOrders.map((order) => (
          <Grid item xs={12} key={order._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                  </Typography>
                  <Chip 
                    label={order.orderStatus} 
                    color={getStatusColor(order.orderStatus)}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Placed on {formatDate(order.createdAt)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {order.products.map((product, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{ 
                        width: 80, 
                        height: 80,
                        borderRadius: 1,
                        objectFit: 'cover',
                        mr: 2
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(product.price)} × {product.quantity}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="body1" fontWeight="bold">
                    Total: {formatCurrency(order.totalAmount)}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/shop/details/${order._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserOrders;