import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../store/order/orderSlice";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Divider,
  Chip,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Collapse,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// Utility components
const StatusChip = ({ status }) => {
  const statusColors = {
    Processing: "warning",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "error",
    Pending: "default"
  };

  return (
    <Chip
      label={status}
      color={statusColors[status] || "default"}
      size="small"
      sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}
    />
  );
};

const ProductItem = ({ product, orderId, index, expandedDescriptions, toggleDescription }) => {
  const isExpanded = expandedDescriptions[`${orderId}-${index}`];
  
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
        <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Qty: {product.quantity} × KES {product.price.toFixed(2)}
          </Typography>
          {product.description && (
            <Box sx={{ mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => toggleDescription(orderId, index)}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Description
                </Typography>
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      {product.description && (
        <Collapse in={isExpanded}>
          <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const OrderCard = ({ 
  order, 
  expandedDescriptions, 
  toggleDescription,
  handleStatusChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 3 }}>
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
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <StatusChip status={order.orderStatus} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Details */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Shipping Address
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: 1
            }}>
              <Typography><strong>Name:</strong> {order.shippingAddress.fullName}</Typography>
              <Typography><strong>Street:</strong> {order.shippingAddress.streetAddress}</Typography>
              <Typography><strong>City:</strong> {order.shippingAddress.city}</Typography>
              <Typography><strong>State:</strong> {order.shippingAddress.state}</Typography>
              <Typography><strong>Country:</strong> {order.shippingAddress.country}</Typography>
              <Typography><strong>Zip:</strong> {order.shippingAddress.zipCode}</Typography>
              <Typography><strong>Phone:</strong> {order.shippingAddress.phoneNumber}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Payment Method:</strong> {order.paymentMethod}</Typography>
              <Typography><strong>Total Amount:</strong> KES {order.totalAmount.toFixed(2)}</Typography>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Update Status
            </Typography>
            <Select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              fullWidth
              size="small"
              disabled={['Delivered', 'Cancelled'].includes(order.orderStatus)}
            >
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Products */}
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Products ({order.products.length})
        </Typography>
        <Box>
          {order.products.map((product, index) => (
            <ProductItem
              key={`${order._id}-${index}`}
              product={product}
              orderId={order._id}
              index={index}
              expandedDescriptions={expandedDescriptions}
              toggleDescription={toggleDescription}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminOrder = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { adminOrders, loading, error } = useSelector((state) => state.orders);

  // State management
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = adminOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(adminOrders.length / ordersPerPage);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, orderStatus: newStatus })).unwrap();
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update order status',
        severity: 'error'
      });
    }
  };

  const toggleDescription = (orderId, productIndex) => {
    const key = `${orderId}-${productIndex}`;
    setExpandedDescriptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRefresh = () => {
    dispatch(fetchAllOrders());
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error loading orders: {error}
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" fontWeight="bold">
          Order Management
        </Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {adminOrders.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
        </Box>
      ) : (
        <>
          {currentOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              expandedDescriptions={expandedDescriptions}
              toggleDescription={toggleDescription}
              handleStatusChange={handleStatusChange}
            />
          ))}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminOrder;