import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../store/order/orderSlice";
import { Snackbar, MenuItem, Select, IconButton } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEMS_PER_PAGE = 5;

const adminOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [productDetails, setProductDetails] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Fetch product details on orders load
  useEffect(() => {
    const fetchAllProductDetails = async () => {
      try {
        const allProductIds = [...new Set(orders.flatMap(order => order.products.map(p => p.productId)))];
        const { data } = await axios.get("/api/products"); // or specific fetch route
        const productMap = {};
        data.forEach(product => {
          productMap[product._id] = product;
        });
        setProductDetails(productMap);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    if (orders.length > 0) fetchAllProductDetails();
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const payload = { orderId, orderStatus: newStatus };
      const updatedOrder = await dispatch(updateOrderStatus(payload)).unwrap();
      setSnackbarMessage(`Order ${updatedOrder._id} status updated to ${updatedOrder.orderStatus}`);
      setSnackbarSeverity("success");
      setOpen(true);
    } catch (error) {
      setSnackbarMessage(`Failed to update order: ${error.message}`);
      setSnackbarSeverity("error");
      setOpen(true);
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseSnackbar = () => setOpen(false);

  // Pagination logic
  const paginatedOrders = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="order-container p-2 sm:p-4 max-w-6xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-4">Order Details</h1>

      {paginatedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        paginatedOrders.map((order) => (
          <div key={order._id} className="order-card mb-6 border p-4 rounded shadow-md bg-white">
            <h2 className="font-semibold text-lg mb-2">Order ID: {order._id}</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td><strong>Created at:</strong></td><td>{new Date(order.createdAt).toLocaleString()}</td></tr>
                    <tr><td><strong>Payment Method:</strong></td><td>{order.paymentMethod}</td></tr>
                    <tr><td><strong>Total Amount:</strong></td><td>${order.totalAmount}</td></tr>
                    <tr><td><strong>Phone Number:</strong></td><td>{order.shippingAddress.phoneNumber}</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr><td><strong>Full Name:</strong></td><td>{order.shippingAddress.fullName}</td></tr>
                    <tr><td><strong>Street:</strong></td><td>{order.shippingAddress.streetAddress}</td></tr>
                    <tr><td><strong>City:</strong></td><td>{order.shippingAddress.city}</td></tr>
                    <tr><td><strong>Country:</strong></td><td>{order.shippingAddress.country}</td></tr>
                    <tr><td><strong>Zip:</strong></td><td>{order.shippingAddress.zipCode}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="mt-4 font-semibold">Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm mt-2">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, index) => {
                    const fullProduct = productDetails[product.productId];
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2">
                          {fullProduct?.images?.[0] ? (
                            <img src={fullProduct.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.quantity}</td>
                        <td className="p-2">${product.price}</td>
                        <td className="p-2">
                          <IconButton size="small" onClick={() => toggleDescription(`${order._id}-${index}`)}>
                            {expandedDescriptions[`${order._id}-${index}`] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          {expandedDescriptions[`${order._id}-${index}`] && (
                            <div className="mt-1 text-gray-700">{fullProduct?.description || "No description"}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Order Status</h3>
              <div className="flex items-center gap-4 mt-2">
                <span>Status: {order.orderStatus || "Pending"}</span>
                <Select
                  size="small"
                  value={order.orderStatus || "Processing"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={["Delivered", "Cancelled"].includes(order.orderStatus)}
                >
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped" disabled={["Shipped", "Delivered"].includes(order.orderStatus)}>Shipped</MenuItem>
                  <MenuItem value="Delivered" disabled={order.orderStatus === "Delivered"}>Delivered</MenuItem>
                  <MenuItem value="Cancelled" disabled={order.orderStatus === "Cancelled"}>Cancelled</MenuItem>
                </Select>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {orders.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Snackbar */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default adminOrder;
