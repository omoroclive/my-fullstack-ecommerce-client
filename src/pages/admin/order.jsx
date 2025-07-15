import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../store/order/orderSlice";
import { Snackbar, MenuItem, Select, Pagination, Box, IconButton, Collapse } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const adminOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  // Snackbar state
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Product data state
  const [productDetails, setProductDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      console.log(`Fetching product details for ID: ${productId}`);
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const productData = await response.json();
      console.log('Product data received:', productData);
      console.log('Product images:', productData.images);
      console.log('Product description:', productData.description);
      
      setProductDetails(prev => ({
        ...prev,
        [productId]: productData
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
      console.error('Product ID that failed:', productId);
    }
  };

  // Fetch address details
  const fetchAddressDetails = async (addressId) => {
    try {
      console.log(`Fetching address details for ID: ${addressId}`);
      const response = await fetch(`/api/address/${addressId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const addressData = await response.json();
      console.log('Address data received:', addressData);
      console.log('Phone number:', addressData.phoneNumber);
      
      setAddressDetails(prev => ({
        ...prev,
        [addressId]: addressData
      }));
    } catch (error) {
      console.error('Error fetching address details:', error);
      console.error('Address ID that failed:', addressId);
    }
  };

  // Fetch additional data when orders change
  useEffect(() => {
    console.log('Orders data:', orders);
    
    if (orders.length > 0) {
      orders.forEach(order => {
        console.log('Processing order:', order._id);
        console.log('Order products:', order.products);
        console.log('Order shipping address:', order.shippingAddress);
        
        // Fetch product details for each product in the order
        order.products.forEach((product, index) => {
          console.log(`Product ${index}:`, product);
          
          // Try different possible property names for product ID
          const productId = product.productId || product._id || product.id;
          console.log(`Product ID found: ${productId}`);
          
          if (productId && !productDetails[productId]) {
            fetchProductDetails(productId);
          } else if (!productId) {
            console.warn('No product ID found for product:', product);
          }
        });

        // Fetch address details - try different approaches
        const shippingAddress = order.shippingAddress;
        if (shippingAddress) {
          // Try different possible property names for address ID
          const addressId = shippingAddress.addressId || shippingAddress._id || shippingAddress.id;
          console.log(`Address ID found: ${addressId}`);
          
          if (addressId && !addressDetails[addressId]) {
            fetchAddressDetails(addressId);
          } else if (!addressId) {
            console.warn('No address ID found, trying to fetch with order ID');
            // If no address ID, try using order ID as fallback
            if (!addressDetails[order._id]) {
              fetchAddressDetails(order._id);
            }
          }
        }
      });
    }
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const payload = { orderId, orderStatus: newStatus };
      console.log("Updating order status with payload:", payload);

      const updatedOrder = await dispatch(updateOrderStatus(payload)).unwrap();

      setSnackbarMessage(`Order ${updatedOrder._id} status updated to ${updatedOrder.orderStatus}`);
      setSnackbarSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbarMessage(`Failed to update order: ${error.message}`);
      setSnackbarSeverity("error");
      setOpen(true);
    }
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  // Toggle description visibility
  const toggleDescription = (orderId, productIndex) => {
    const key = `${orderId}-${productIndex}`;
    setExpandedDescriptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    console.log(`Page changed to: ${value}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error fetching orders: {error}</div>;

  return (
    <div className="order-container">
      <h1 className="order-title">Order Management</h1>
      
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <>
          {currentOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h2 className="order-id">Order ID: {order._id}</h2>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="order-content">
                <div className="order-info-section">
                  <h3>Order Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Payment Method:</span>
                      <span className="info-value">{order.paymentMethod}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Amount:</span>
                      <span className="info-value">${order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="shipping-section">
                  <h3>Shipping Address</h3>
                  <div className="address-grid">
                    <div className="address-item">
                      <span className="address-label">Full Name:</span>
                      <span className="address-value">{order.shippingAddress.fullName}</span>
                    </div>
                    <div className="address-item">
                      <span className="address-label">Street Address:</span>
                      <span className="address-value">{order.shippingAddress.streetAddress}</span>
                    </div>
                    <div className="address-item">
                      <span className="address-label">City:</span>
                      <span className="address-value">{order.shippingAddress.city}</span>
                    </div>
                    <div className="address-item">
                      <span className="address-label">Country:</span>
                      <span className="address-value">{order.shippingAddress.country}</span>
                    </div>
                    <div className="address-item">
                      <span className="address-label">Zip Code:</span>
                      <span className="address-value">{order.shippingAddress.zipCode}</span>
                    </div>
                    {(() => {
                      const addressId = order.shippingAddress.addressId || order.shippingAddress._id || order.shippingAddress.id || order._id;
                      const addressData = addressDetails[addressId];
                      console.log('Rendering phone number for address ID:', addressId);
                      console.log('Address data available:', addressData);
                      
                      if (addressData && addressData.phoneNumber) {
                        return (
                          <div className="address-item">
                            <span className="address-label">Phone Number:</span>
                            <span className="address-value">
                              {addressData.phoneNumber}
                            </span>
                          </div>
                        );
                      } else {
                        console.log('No phone number found for this address');
                        return null;
                      }
                    })()}
                  </div>
                </div>

                <div className="products-section">
                  <h3>Products</h3>
                  <div className="products-list">
                    {order.products.map((product, index) => {
                      const productId = product.productId || product._id || product.id;
                      const productDetail = productDetails[productId];
                      const descriptionKey = `${order._id}-${index}`;
                      const isExpanded = expandedDescriptions[descriptionKey];

                      console.log(`Rendering product ${index}:`, product);
                      console.log(`Product ID: ${productId}`);
                      console.log(`Product detail:`, productDetail);
                      console.log(`Product images:`, productDetail?.images);
                      console.log(`Product description:`, productDetail?.description);

                      return (
                        <div key={index} className="product-item">
                          <div className="product-main">
                            {(() => {
                              if (productDetail?.images && productDetail.images.length > 0 && productDetail.images[0]) {
                                console.log('Rendering image:', productDetail.images[0]);
                                return (
                                  <div className="product-image">
                                    <img 
                                      src={productDetail.images[0]} 
                                      alt={product.name}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        console.log('Image failed to load:', productDetail.images[0]);
                                      }}
                                      onLoad={() => {
                                        console.log('Image loaded successfully:', productDetail.images[0]);
                                      }}
                                    />
                                  </div>
                                );
                              } else {
                                console.log('No image available for product:', productId);
                                return (
                                  <div className="product-image">
                                    <div className="no-image">No Image</div>
                                  </div>
                                );
                              }
                            })()}
                            <div className="product-info">
                              <div className="product-name">{product.name}</div>
                              <div className="product-details">
                                <span className="product-quantity">Qty: {product.quantity}</span>
                                <span className="product-price">${product.price}</span>
                              </div>
                              {(() => {
                                if (productDetail?.description) {
                                  console.log('Rendering description toggle for:', productId);
                                  return (
                                    <div className="product-description-toggle">
                                      <IconButton
                                        onClick={() => toggleDescription(order._id, index)}
                                        size="small"
                                        className="description-toggle-btn"
                                      >
                                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        <span>Description</span>
                                      </IconButton>
                                    </div>
                                  );
                                } else {
                                  console.log('No description available for product:', productId);
                                  return null;
                                }
                              })()}
                            </div>
                          </div>
                          {productDetail?.description && (
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <div className="product-description">
                                {productDetail.description}
                              </div>
                            </Collapse>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="status-section">
                  <h3>Order Status</h3>
                  <div className="status-controls">
                    <div className="current-status">
                      Status: <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                        {order.orderStatus || "Pending"}
                      </span>
                    </div>
                    <Select
                      value={order.orderStatus || "Processing"}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"}
                      displayEmpty
                      className="status-select"
                      size="small"
                    >
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped" disabled={order.orderStatus === "Shipped" || order.orderStatus === "Delivered"}>
                        Shipped
                      </MenuItem>
                      <MenuItem value="Delivered" disabled={order.orderStatus === "Delivered"}>
                        Delivered
                      </MenuItem>
                      <MenuItem value="Cancelled" disabled={order.orderStatus === "Cancelled"}>
                        Cancelled
                      </MenuItem>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <Box className="pagination-container">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Snackbar for status update */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .order-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .order-title {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
          font-size: 2rem;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 1.2rem;
        }

        .no-orders {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
        }

        .order-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
          overflow: hidden;
        }

        .order-header {
          background: #f8f9fa;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .order-id {
          margin: 0;
          color: #495057;
          font-size: 1.3rem;
        }

        .order-date {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .order-content {
          padding: 20px;
        }

        .order-info-section, .shipping-section, .products-section, .status-section {
          margin-bottom: 25px;
        }

        .order-info-section h3, .shipping-section h3, .products-section h3, .status-section h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 1.2rem;
          border-bottom: 2px solid #007bff;
          padding-bottom: 5px;
        }

        .info-grid, .address-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
        }

        .info-item, .address-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-label, .address-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .info-value, .address-value {
          color: #212529;
          font-size: 1rem;
        }

        .products-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .product-item {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .product-main {
          display: flex;
          gap: 15px;
          padding: 15px;
        }

        .product-image {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #e9ecef;
          color: #6c757d;
          font-size: 0.8rem;
          text-align: center;
        }

        .product-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-name {
          font-weight: 600;
          font-size: 1.1rem;
          color: #212529;
        }

        .product-details {
          display: flex;
          gap: 20px;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .product-quantity, .product-price {
          font-weight: 500;
        }

        .product-description-toggle {
          margin-top: 8px;
        }

        .description-toggle-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #007bff;
          padding: 4px 8px;
        }

        .description-toggle-btn span {
          font-size: 0.85rem;
        }

        .product-description {
          padding: 15px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          color: #495057;
          line-height: 1.5;
        }

        .status-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .status-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .current-status {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-processing {
          background: #fff3cd;
          color: #856404;
        }

        .status-shipped {
          background: #d4edda;
          color: #155724;
        }

        .status-delivered {
          background: #d1ecf1;
          color: #0c5460;
        }

        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .status-pending {
          background: #e2e3e5;
          color: #383d41;
        }

        .status-select {
          min-width: 150px;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 40px;
          padding: 20px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .order-container {
            padding: 10px;
          }

          .order-title {
            font-size: 1.5rem;
          }

          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .order-id {
            font-size: 1.1rem;
          }

          .order-content {
            padding: 15px;
          }

          .info-grid, .address-grid {
            grid-template-columns: 1fr;
          }

          .product-main {
            flex-direction: column;
            gap: 10px;
          }

          .product-image {
            width: 60px;
            height: 60px;
            align-self: flex-start;
          }

          .product-details {
            flex-direction: column;
            gap: 5px;
          }

          .status-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .status-select {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .order-container {
            padding: 5px;
          }

          .order-card {
            margin-bottom: 20px;
          }

          .order-header {
            padding: 15px;
          }

          .order-content {
            padding: 10px;
          }

          .product-main {
            padding: 10px;
          }

          .product-image {
            width: 50px;
            height: 50px;
          }

          .product-name {
            font-size: 1rem;
          }

          .status-section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default adminOrder;