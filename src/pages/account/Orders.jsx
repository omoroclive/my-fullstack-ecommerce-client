import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchUserOrders, 
  fetchAllOrders, 
  updateOrderStatus 
} from "../../store/order/orderSlice";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Box,
  Chip,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const OrdersManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Get user role from Redux state (assuming you have auth state)
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;
  
  // Get orders from Redux state
  const { 
    userOrders, 
    adminOrders, 
    loadingUser, 
    loadingAdmin,
    updating,
    error 
  } = useSelector((state) => state.orders);
  
  // Determine which orders to display
  const orders = isAdmin ? adminOrders : userOrders;
  const loading = isAdmin ? loadingAdmin : loadingUser;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAllOrders());
    } else {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, orderStatus: newStatus })).unwrap();
      // Refresh orders after update
      if (isAdmin) {
        dispatch(fetchAllOrders());
      } else {
        dispatch(fetchUserOrders());
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.orderStatus === statusFilter
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'highest') return b.totalAmount - a.totalAmount;
    if (sortBy === 'lowest') return a.totalAmount - b.totalAmount;
    return 0;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return "success";
      case "Shipped": return "primary";
      case "Processing": return "warning";
      case "Cancelled": return "error";
      case "Pending": return "default";
      default: return "info";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (loading) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading orders...</Typography>
    </Container>
  );

  if (error) return (
    <Container sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="error">{error}</Typography>
      <Button 
        variant="outlined" 
        onClick={() => isAdmin ? dispatch(fetchAllOrders()) : dispatch(fetchUserOrders())}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Container>
  );

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
          {isAdmin ? 'Orders Management' : 'My Orders'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
              startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="highest">Highest Amount</MenuItem>
              <MenuItem value="lowest">Lowest Amount</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Refresh Orders">
            <IconButton 
              onClick={() => isAdmin ? dispatch(fetchAllOrders()) : dispatch(fetchUserOrders())}
              disabled={updating}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {sortedOrders.length === 0 ? (
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {statusFilter !== 'all' ? `No ${statusFilter} orders` : 'No orders have been placed yet'}
          </Typography>
          {!isAdmin && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/shop')}
              startIcon={<ShoppingBagIcon />}
            >
              Continue Shopping
            </Button>
          )}
        </Box>
      ) : isMobile ? (
        <Grid container spacing={3}>
          {sortedOrders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </Typography>
                    <Chip 
                      label={order.orderStatus} 
                      color={getStatusColor(order.orderStatus)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDate(order.createdAt)} • {order.products.length} item(s)
                  </Typography>

                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {formatCurrency(order.totalAmount)}
                  </Typography>

                  {isAdmin && (
                    <Typography variant="body2" gutterBottom>
                      Customer: {order.shippingAddress.fullName}
                    </Typography>
                  )}

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mt: 2,
                    gap: 1
                  }}>
                    {isAdmin && (
                      <FormControl fullWidth size="small">
                        <InputLabel>Update Status</InputLabel>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          label="Update Status"
                          disabled={updating}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={() => navigate(isAdmin ? `/admin/orders/${order._id}` : `/orders/${order._id}`)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                {isAdmin && <TableCell>Customer</TableCell>}
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                {isAdmin && <TableCell>Payment</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  
                  {isAdmin && (
                    <TableCell>
                      {order.shippingAddress.fullName}
                      {order.user && (
                        <Typography variant="body2" color="text.secondary">
                          {order.user.email}
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {order.products.slice(0, 2).map((item, idx) => (
                        <Tooltip key={idx} title={item.name}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ 
                              width: 40, 
                              height: 40,
                              borderRadius: 1,
                              objectFit: 'cover'
                            }}
                          />
                        </Tooltip>
                      ))}
                      {order.products.length > 2 && (
                        <Chip 
                          label={`+${order.products.length - 2}`} 
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                  
                  {isAdmin && (
                    <TableCell>
                      <Chip 
                        label={order.paymentMethod} 
                        size="small"
                        color={order.isPaid ? 'success' : 'default'}
                      />
                      {order.isPaid && (
                        <Typography variant="body2" color="text.secondary">
                          Paid on {formatDate(order.paidAt)}
                        </Typography>
                      )}
                    </TableCell>
                  )}

                  <TableCell>
                    {isAdmin ? (
                      <FormControl fullWidth size="small">
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating}
                          sx={{
                            '& .MuiSelect-select': {
                              color: theme.palette[getStatusColor(order.orderStatus)].main,
                              fontWeight: 'bold'
                            }
                          }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip 
                        label={order.orderStatus} 
                        color={getStatusColor(order.orderStatus)}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={() => navigate(isAdmin ? `/admin/orders/${order._id}` : `/orders/${order._id}`)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {isAdmin && (
                      <Tooltip title="Edit Order">
                        <IconButton color="secondary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrdersManagement;