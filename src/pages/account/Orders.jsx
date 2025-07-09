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
  Box
} from "@mui/material";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchOrders());

    // Set up polling interval
    const interval = setInterval(() => {
      dispatch(fetchOrders());
    }, 15000); // every 15 seconds

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  const getOrderStep = (orderStatus) => {
    switch (orderStatus) {
      case "Ordered":
        return 0;
      case "Shipped":
        return 1;
      case "Delivered":
        return 2;
      default:
        return 0;
    }
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
                    <Typography variant="subtitle1" fontWeight="bold">
                      Order Tracking:
                    </Typography>
                    <Stepper activeStep={getOrderStep(order.orderStatus)} alternativeLabel>
                      <Step>
                        <StepLabel>Placed On ({new Date(order.createdAt).toLocaleDateString()})</StepLabel>
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
                    Placed On: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Invalid Date"}
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
                      onClick={() => navigate("/shop/details")}
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