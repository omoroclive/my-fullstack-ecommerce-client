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
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusSteps = (order) => {
    const steps = [
      {
        label: "Order Placed",
        icon: <ShoppingBagIcon />,
        completed: true,
        active: false,
        date: order.createdAt
      },
      {
        label: "Processing",
        icon: <LocalShippingIcon />,
        completed: ["Processing", "Shipped", "Delivered"].includes(order.orderStatus),
        active: order.orderStatus === "Processing",
        date: order.processedAt
      },
      {
        label: "Shipped",
        icon: <LocalShippingIcon />,
        completed: ["Shipped", "Delivered"].includes(order.orderStatus),
        active: order.orderStatus === "Shipped",
        date: order.shippedAt
      },
      {
        label: "Delivered",
        icon: <CheckCircleIcon />,
        completed: order.orderStatus === "Delivered",
        active: false,
        date: order.deliveredAt
      }
    ];
    
    // Filter out steps that don't have dates if order hasn't reached that stage
    return steps.filter(step => step.completed || step.active || step.label === "Order Placed");
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "success";
      case "Shipped": return "primary";
      case "Processing": return "warning";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  if (loading) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading your orders...</Typography>
    </Container>
  );

  if (error) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="error">{error}</Typography>
      <Button 
        variant="outlined" 
        onClick={() => dispatch(fetchOrders())}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            You haven't placed any orders yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/shop')}
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: 3,
                overflow: 'visible'
              }}>
                <CardContent>
                  {/* Order Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    mb: 2
                  }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDate(order.createdAt)}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip 
                        label={order.orderStatus} 
                        color={getStatusColor(order.orderStatus)}
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Tracking */}
                  <Box sx={{ mb: 3 }}>
                    <Stepper 
                      activeStep={getStatusSteps(order).findIndex(step => step.active)} 
                      alternativeLabel
                      orientation={isMobile ? "vertical" : "horizontal"}
                    >
                      {getStatusSteps(order).map((step, index) => (
                        <Step key={step.label} completed={step.completed}>
                          <StepLabel 
                            StepIconComponent={() => (
                              <Box sx={{ 
                                color: step.completed ? theme.palette.success.main : 
                                      step.active ? theme.palette.primary.main : 
                                      theme.palette.text.disabled
                              }}>
                                {step.icon}
                              </Box>
                            )}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              {step.label}
                            </Typography>
                            {step.date && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {formatDate(step.date)}
                              </Typography>
                            )}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Items Ordered
                    </Typography>
                    <Grid container spacing={2}>
                      {order.products.map((item) => (
                        <Grid item xs={12} sm={6} key={item._id}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2,
                            alignItems: 'center'
                          }}>
                            <CardMedia
                              component="img"
                              image={item.image}
                              alt={item.name}
                              sx={{ 
                                width: 80, 
                                height: 80,
                                borderRadius: 1,
                                objectFit: 'cover'
                              }}
                            />
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {item.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                KES {item.price.toFixed(2)} × {item.quantity}
                              </Typography>
                              {item.size && (
                                <Typography variant="caption">
                                  Size: {item.size}
                                </Typography>
                              )}
                              {item.color && (
                                <Typography variant="caption" display="block">
                                  Color: {item.color}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Order Summary */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Shipping Address
                      </Typography>
                      <Typography>
                        {order.shippingAddress.fullName}
                      </Typography>
                      <Typography>
                        {order.shippingAddress.streetAddress}
                      </Typography>
                      <Typography>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </Typography>
                      <Typography>
                        {order.shippingAddress.country}, {order.shippingAddress.zipCode}
                      </Typography>
                      <Typography>
                        Phone: {order.shippingAddress.phoneNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Order Summary
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                        <Typography>Subtotal:</Typography>
                        <Typography>KES {order.totalAmount.toFixed(2)}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                        <Typography>Payment Method:</Typography>
                        <Typography>{order.paymentMethod}</Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mb: 1
                      }}>
                        <Typography>Status:</Typography>
                        <Typography color={getStatusColor(order.orderStatus)}>
                          {order.orderStatus}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontWeight: 'bold'
                      }}>
                        <Typography>Total:</Typography>
                        <Typography>KES {order.totalAmount.toFixed(2)}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: 2,
                    mt: 3
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/account/orders/${order._id}`)}
                    >
                      View Details
                    </Button>
                    {order.orderStatus === "Delivered" && (
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/account/orders/${order._id}/review`)}
                      >
                        Leave Review
                      </Button>
                    )}
                  </Box>
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