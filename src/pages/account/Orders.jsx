import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/order/orderSlice";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Chip,
  useMediaQuery,
  useTheme
} from "@mui/material";

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchOrders());
    const interval = setInterval(() => dispatch(fetchOrders()), 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const getStatusSteps = (order) => {
    return [
      {
        label: "Order Placed",
        date: order.createdAt,
        completed: true,
        active: false
      },
      {
        label: "Processing",
        date: order.processedAt,
        completed: ["Processing", "Shipped", "Delivered"].includes(order.orderStatus),
        active: order.orderStatus === "Processing"
      },
      {
        label: "Shipped",
        date: order.shippedAt,
        completed: ["Shipped", "Delivered"].includes(order.orderStatus),
        active: order.orderStatus === "Shipped"
      },
      {
        label: "Delivered",
        date: order.deliveredAt,
        completed: order.orderStatus === "Delivered",
        active: false
      }
    ];
  };

  const formatDate = (date) => {
    if (!date) return "Pending";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ py: 4 }}>
      {orders.length > 0 && (
        <Box sx={{ 
          bgcolor: 'grey.100', 
          py: 2, 
          px: 3, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h5" align="center" fontWeight="bold">
            {orders[0]?.shippingAddress?.fullName || "Customer"}'s Orders
          </Typography>
        </Box>
      )}

      {orders.length === 0 ? (
        <Typography variant="body1" align="center">
          No orders found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card sx={{ 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Order Status Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Order Tracking:
                      <Chip 
                        label={order.orderStatus} 
                        color={
                          order.orderStatus === "Delivered" ? "success" :
                          order.orderStatus === "Shipped" ? "primary" :
                          order.orderStatus === "Processing" ? "warning" : "default"
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    
                    <Stepper 
                      activeStep={getStatusSteps(order).findIndex(step => step.active)} 
                      alternativeLabel
                      orientation={isMobile ? "vertical" : "horizontal"}
                    >
                      {getStatusSteps(order).map((step, index) => (
                        <Step key={step.label} completed={step.completed}>
                          <StepLabel>
                            {step.label}
                            <Typography variant="caption" display="block">
                              {formatDate(step.date)}
                            </Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Order ID */}
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Order ID: {order._id}
                  </Typography>

                  {/* Products Section */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Products:
                    </Typography>
                    <Grid container spacing={1}>
                      {order.orderItems.map((item) => (
                        <Grid item xs={12} key={item._id}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            mb: 1
                          }}>
                            <CardMedia
                              component="img"
                              image={item.image?.url || '/placeholder-product.jpg'}
                              alt={item.name}
                              sx={{ 
                                width: 60, 
                                height: 60,
                                borderRadius: 1,
                                objectFit: 'cover'
                              }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Order Summary */}
                  <Box sx={{ 
                    bgcolor: 'grey.50',
                    p: 2,
                    borderRadius: 1,
                    mb: 2
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Order Summary:
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 0.5
                    }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">${order.itemsPrice.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 0.5
                    }}>
                      <Typography variant="body2">Shipping:</Typography>
                      <Typography variant="body2">${order.shippingPrice.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mb: 0.5
                    }}>
                      <Typography variant="body2">Tax:</Typography>
                      <Typography variant="body2">${order.taxPrice.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontWeight: 'bold'
                    }}>
                      <Typography variant="body2">Total:</Typography>
                      <Typography variant="body2">${order.totalPrice.toFixed(2)}</Typography>
                    </Box>
                  </Box>

                  {/* Action Button */}
                  {order.orderStatus === "Delivered" ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate("/account/ratings")}
                      sx={{ 
                        mt: 2,
                        bgcolor: 'warning.main',
                        '&:hover': { bgcolor: 'warning.dark' }
                      }}
                    >
                      Rate Product
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/shop/order-details/${order._id}`)}
                      sx={{ 
                        mt: 2,
                        bgcolor: 'warning.main',
                        '&:hover': { bgcolor: 'warning.dark' }
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserOrders;