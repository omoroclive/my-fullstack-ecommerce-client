import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/order/orderSlice";
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
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Utility functions moved outside component
const getStatusSteps = (order) => {
  return [
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
  ].filter(step => step.completed || step.active || step.label === "Order Placed");
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
  const statusColors = {
    "Delivered": "success",
    "Shipped": "primary",
    "Processing": "warning",
    "Cancelled": "error",
    "default": "default"
  };
  return statusColors[status] || statusColors.default;
};

// Sub-components for better organization
const OrderStatusStepper = ({ order, isMobile, theme }) => (
  <Stepper 
    activeStep={getStatusSteps(order).findIndex(step => step.active)} 
    alternativeLabel
    orientation={isMobile ? "vertical" : "horizontal"}
  >
    {getStatusSteps(order).map((step) => (
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
);

const OrderItem = ({ item }) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
    <CardMedia
      component="img"
      image={item.image}
      alt={item.name}
      sx={{ width: 80, height: 80, borderRadius: 1, objectFit: 'cover' }}
    />
    <Box>
      <Typography variant="body1" fontWeight="medium">{item.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        KES {item.price.toFixed(2)} × {item.quantity}
      </Typography>
      {item.size && <Typography variant="caption">Size: {item.size}</Typography>}
      {item.color && (
        <Typography variant="caption" display="block">Color: {item.color}</Typography>
      )}
    </Box>
  </Box>
);

const OrderSummary = ({ order }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Shipping Address
      </Typography>
      <Typography>{order.shippingAddress.fullName}</Typography>
      <Typography>{order.shippingAddress.streetAddress}</Typography>
      <Typography>
        {order.shippingAddress.city}, {order.shippingAddress.state}
      </Typography>
      <Typography>
        {order.shippingAddress.country}, {order.shippingAddress.zipCode}
      </Typography>
      <Typography>Phone: {order.shippingAddress.phoneNumber}</Typography>
    </Grid>
    <Grid item xs={12} md={6}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Order Summary
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal:</Typography>
        <Typography>KES {order.totalAmount.toFixed(2)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Payment Method:</Typography>
        <Typography>{order.paymentMethod}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Status:</Typography>
        <Typography color={getStatusColor(order.orderStatus)}>
          {order.orderStatus}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <Typography>Total:</Typography>
        <Typography>KES {order.totalAmount.toFixed(2)}</Typography>
      </Box>
    </Grid>
  </Grid>
);

const LoadingState = () => (
  <Container sx={{ py: 4, textAlign: 'center' }}>
    <Typography variant="h6">Loading your orders...</Typography>
  </Container>
);

const ErrorState = ({ error, onRetry }) => (
  <Container sx={{ py: 4, textAlign: 'center' }}>
    <Typography color="error">{error}</Typography>
    <Button variant="outlined" onClick={onRetry} sx={{ mt: 2 }}>
      Retry
    </Button>
  </Container>
);

const EmptyState = ({ onNavigate }) => (
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
    <Button variant="contained" onClick={onNavigate} sx={{ mt: 2 }}>
      Start Shopping
    </Button>
  </Box>
);

const OrderCard = ({ order, isMobile, theme, navigate }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
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
            sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Order Tracking
        </Typography>
        <OrderStatusStepper order={order} isMobile={isMobile} theme={theme} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Items Ordered
        </Typography>
        <Grid container spacing={2}>
          {order.products.map((item) => (
            <Grid item xs={12} sm={6} key={item._id}>
              <OrderItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <OrderSummary order={order} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate(`/shop/details/${order._id}`)}>
          View Details
        </Button>
        {order.orderStatus === "Delivered" && (
          <Button variant="contained" onClick={() => navigate(`/account/ratings/${order._id}`)}>
            Leave Review
          </Button>
        )}
      </Box>
    </CardContent>
  </Card>
);

const UserOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userOrders: orders, loading, error } = useSelector((state) => state.orders);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={() => dispatch(fetchUserOrders())} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <EmptyState onNavigate={() => navigate('/shop/home')} />
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <OrderCard 
                order={order} 
                isMobile={isMobile} 
                theme={theme} 
                navigate={navigate} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserOrders;