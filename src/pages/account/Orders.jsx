import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../store/order/orderSlice";
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
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [notification, setNotification] = React.useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Initial fetch
    dispatch(fetchOrders());

    // Set up polling interval
    const interval = setInterval(() => {
      dispatch(fetchOrders());
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, orderStatus: newStatus })).unwrap();
      setNotification({
        open: true,
        message: 'Order status updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: `Failed to update status: ${error}`,
        severity: 'error'
      });
    }
  };

  const getOrderStep = (orderStatus) => {
    const statusMap = {
      "Pending": 0,
      "Processing": 1,
      "Shipped": 2,
      "Delivered": 3,
      "Cancelled": 0
    };
    return statusMap[orderStatus] || 0;
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading && orders.length === 0) {
    return (
      <Container className="p-6 mt-6 flex justify-center">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-6 mt-6">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="p-6 mt-6">
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      {orders.length > 0 && (
        <Box className="bg-gray-100 py-4 px-6 w-full mb-6 rounded-lg shadow-md">
          <Typography variant="h5" align="center" fontWeight="bold">
            {orders[0]?.shippingAddress?.fullName || "Customer"}'s Orders
          </Typography>
        </Box>
      )}

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card className="shadow-lg p-4" style={{ borderRadius: "8px", border: "1px solid #ddd" }}>
                <CardContent>
                  <Box className="mb-4">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order Tracking:
                    </Typography>
                    <Stepper activeStep={getOrderStep(order.orderStatus)} alternativeLabel>
                      <Step>
                        <StepLabel>Placed On ({new Date(order.createdAt).toLocaleDateString()})</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Processing</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Shipped ({order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : "Pending"})</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Delivered ({order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "Pending"})</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>

                  <Typography variant="h6" fontWeight="bold">
                    Order ID: {order._id}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Status: {order.orderStatus}
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" className="mb-4">
                    Total: ${order.totalAmount.toFixed(2)}
                  </Typography>

                  <div className="mt-4">
                    {order.products.map((product) => (
                      <div key={product._id} className="flex items-center mb-3">
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover mr-4 rounded"
                        />
                        <div>
                          <Typography variant="body2" fontWeight="bold">{product.name}</Typography>
                          <Typography variant="body2">
                            Quantity: {product.quantity} | Price: ${product.price.toFixed(2)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.orderStatus === "Delivered" ? (
                    <Button
                      variant="contained"
                      onClick={() => navigate("/account/ratings")}
                      className="mt-4 w-full"
                      style={{ backgroundColor: "#ff9800" }}
                    >
                      Rate Product
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/shop/order-details/${order._id}`)}
                      className="mt-4 w-full"
                      style={{ backgroundColor: "#ff9800" }}
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

export default Orders;