import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../store/order/orderSlice";
import { Snackbar, MenuItem, Select } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Updated to use 'status' instead of 'orderStatus'
      const payload = { orderId, status: newStatus };
      console.log("Updating order status with payload:", payload);

      const updatedOrder = await dispatch(updateOrderStatus(payload)).unwrap();

      setSnackbarMessage(`Order ${updatedOrder._id} status updated to ${updatedOrder.status}`);
      setSnackbarSeverity("success");
      setOpen(true);
    } catch (error) {
      setSnackbarMessage(`Failed to update order: ${error.message}`);
      setSnackbarSeverity("error");
      setOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="order-container">
      <h1 className="text-center">Order Details</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h2>Order ID: {order._id}</h2>
            <table className="order-table">
              <thead>
                <tr>
                  <th colSpan="2">Order Information</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Created at:</strong></td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                  <td><strong>Payment Method:</strong></td>
                  <td>{order.paymentMethod}</td>
                </tr>
                <tr>
                  <td><strong>Total Amount:</strong></td>
                  <td>${order.totalAmount}</td>
                </tr>
              </tbody>
            </table>

            <h3>Shipping Address</h3>
            <table className="address-table">
              <tbody>
                <tr>
                  <td><strong>Full Name:</strong></td>
                  <td>{order.shippingAddress.fullName}</td>
                </tr>
                <tr>
                  <td><strong>Street Address:</strong></td>
                  <td>{order.shippingAddress.streetAddress}</td>
                </tr>
                <tr>
                  <td><strong>City:</strong></td>
                  <td>{order.shippingAddress.city}</td>
                </tr>
                <tr>
                  <td><strong>Country:</strong></td>
                  <td>{order.shippingAddress.country}</td>
                </tr>
                <tr>
                  <td><strong>Zip Code:</strong></td>
                  <td>{order.shippingAddress.zipCode}</td>
                </tr>
              </tbody>
            </table>

            <h3>Products</h3>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-status">
              <h3>Order Status</h3>
              {/* Updated to use 'status' instead of 'orderStatus' */}
              <p>Status: {order.status || "Pending"}</p>
              <Select
                value={order.status || "Processing"}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                disabled={order.status === "Delivered" || order.status === "Cancelled"}
                displayEmpty
                className="status-select"
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped" disabled={order.status === "Shipped" || order.status === "Delivered"}>Shipped</MenuItem>
                <MenuItem value="Delivered" disabled={order.status === "Delivered"}>Delivered</MenuItem>
                <MenuItem value="Cancelled" disabled={order.status === "Cancelled"}>Cancelled</MenuItem>
              </Select>
            </div>
          </div>
        ))
      )}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Order;