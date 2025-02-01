import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Card, CardContent, CardMedia, Grid, Container, Stepper, Step, StepLabel, Box } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000"; // Replace with your backend URL

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getOrderStep = (status) => {
    switch (status) {
      case "Ordered": return 0;
      case "Shipped": return 1;
      case "Delivered": return 2;
      default: return 0;
    }
  };

  if (loading) return <Typography>Loading orders...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container className="p-6 mt-6">
      {orders.length > 0 && (
        <Box className="bg-gray-200 py-4 px-6 w-full mb-6">
          <Typography variant="h4" align="center" fontWeight="bold">{orders[0].shippingAddress.fullName}'s Orders</Typography>
        </Box>
      )}

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card className="shadow-lg p-4">
                <CardContent>
                  {/* Order Tracking */}
                  <Box className="mb-4">
                    <Typography variant="subtitle1" fontWeight="bold">Order Tracking:</Typography>
                    <Stepper activeStep={getOrderStep(order.status)} alternativeLabel>
                      <Step>
                        <StepLabel>Placed On ({new Date(order.orderedAt).toLocaleDateString()})</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Shipped ({order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : "Pending"})</StepLabel>
                      </Step>
                      <Step>
                        <StepLabel>Delivered ({order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : "Pending"})</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>

                  <Typography variant="h6" fontWeight="bold">Order ID: {order._id}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">Placed On: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">Status: {order.status}</Typography>
                  <Typography variant="h6" fontWeight="bold" className="mb-4">Total: ${order.totalAmount.toFixed(2)}</Typography>

                  {/* Products in Order */}
                  <div className="mt-4">
                    {order.products.map((product) => (
                      <div key={product._id} className="flex items-center mb-4">
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-contain mr-4 rounded"
                        />
                        <div>
                          <Typography variant="body1" fontWeight="bold">{product.name}</Typography>
                          <Typography variant="body2">Quantity: {product.quantity} | Price: ${product.price.toFixed(2)}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#ff9800", color: "white" }}
                    onClick={() => handleViewDetails(order._id)}
                    className="mt-4"
                  >
                    View Details
                  </Button>
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

