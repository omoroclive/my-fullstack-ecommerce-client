import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../../store/order/orderSlice";
import { 
  Snackbar, 
  MenuItem, 
  Select, 
  TablePagination, 
  IconButton, 
  Collapse,
  useMediaQuery,
  useTheme 
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const adminOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Expanded descriptions state
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [phoneNumbers, setPhoneNumbers] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    // Fetch phone numbers for each order
    const fetchPhoneNumbers = async () => {
      const phoneData = {};
      for (const order of orders) {
        try {
          const response = await fetch(`/api/address/${id}`);
          const data = await response.json();
          phoneData[id] = data.phoneNumber;
        } catch (error) {
          console.error(`Failed to fetch phone number for order ${id}:`, error);
          phoneData[id] = "N/A";
        }
      }
      setPhoneNumbers(phoneData);
    };

    if (orders.length > 0) {
      fetchPhoneNumbers();
    }
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

  const toggleDescription = (orderId, productIndex) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [`${orderId}-${productIndex}`]: !prev[`${orderId}-${productIndex}`]
    }));
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="order-container" style={{ padding: isMobile ? '10px' : '20px' }}>
      <h1 className="text-center" style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
        Order Details
      </h1>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
            <div 
              key={order._id} 
              className="order-card" 
              style={{
                marginBottom: '20px',
                padding: isMobile ? '10px' : '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
                Order ID: {order._id}
              </h2>
              
              <div style={{ 
                display: isMobile ? 'block' : 'flex', 
                justifyContent: 'space-between',
                flexWrap: 'wrap'
              }}>
                <table className="order-table" style={{ 
                  width: isMobile ? '100%' : '48%',
                  marginBottom: isMobile ? '15px' : '0'
                }}>
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

                <table className="address-table" style={{ 
                  width: isMobile ? '100%' : '48%',
                  marginBottom: '15px'
                }}>
                  <thead>
                    <tr>
                      <th colSpan="2">Shipping Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Full Name:</strong></td>
                      <td>{order.shippingAddress.fullName}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{phoneNumbers[order._id] || "Loading..."}</td>
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
              </div>

              <h3 style={{ marginTop: '15px' }}>Products</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="products-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((product, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>
                            {product.images && product.images[0] && (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                style={{ 
                                  width: '50px', 
                                  height: '50px',
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }} 
                              />
                            )}
                          </td>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>${product.price}</td>
                          <td>
                            <IconButton 
                              size="small" 
                              onClick={() => toggleDescription(order._id, index)}
                              aria-label="toggle description"
                            >
                              {expandedDescriptions[`${order._id}-${index}`] ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 0 }}>
                            <Collapse in={expandedDescriptions[`${order._id}-${index}`]}>
                              <div style={{ 
                                padding: '10px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                margin: '5px 0'
                              }}>
                                <strong>Description:</strong> {product.description || 'No description available'}
                              </div>
                            </Collapse>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-status" style={{ marginTop: '15px' }}>
                <h3>Order Status</h3>
                <p>Status: {order.orderStatus || "Pending"}</p>
                <Select
                  value={order.orderStatus || "Processing"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                  displayEmpty
                  className="status-select"
                  style={{ minWidth: '150px' }}
                >
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped" disabled={order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}>Shipped</MenuItem>
                  <MenuItem value="Delivered" disabled={order.orderStatus === "Delivered"}>Delivered</MenuItem>
                  <MenuItem value="Cancelled" disabled={order.orderStatus === "Cancelled"}>Cancelled</MenuItem>
                </Select>
              </div>
            </div>
          ))}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ marginTop: '20px' }}
          />
        </>
      )}

      {/* Snackbar for status update */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default adminOrder;