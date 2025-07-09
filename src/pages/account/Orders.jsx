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
  Chip
} from "@mui/material";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);

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
    <Container className="p-6 mt-6">
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
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Order Tracking:
                      <Chip 
                        label={order.orderStatus} 
                        color={
                          order.orderStatus === "Delivered" ? "success" :
                          order.orderStatus === "Shipped" ? "primary" :
                          order.orderStatus === "Processing" ? "warning" : "default"
                        }
                        style={{ marginLeft: 10 }}
                      />
                    </Typography>
                    
                    <Stepper activeStep={getStatusSteps(order).findIndex(step => step.active)} alternativeLabel>
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

                  {/* Rest of your order details */}
                  <Typography variant="h6" fontWeight="bold">
                    Order ID: {order._id}
                  </Typography>
                  
                  {/* ... other order details ... */}

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