import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInventory,
  initializeInventory,
  updateInventory
} from '../../store/inventory/inventorySlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import InventoryForm from '../../components/inventoryForm';

const Inventory = () => {
  const dispatch = useDispatch();
  const {
    items,
    status,
    error,
    totalPages,
    currentPage,
    totalItems
  } = useSelector((state) => state.inventory);

  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchInventory({
        page,
        search,
        status: filter !== 'all' ? filter : undefined,
        token
      }));
    }
  }, [dispatch, page, search, filter]);

  const columns = [
    { field: 'sku', headerName: 'SKU', width: 150 },
    {
      field: 'product',
      headerName: 'Product',
      width: 200,
      renderCell: (params) => params.row.product?.name || 'N/A'
    },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'availableStock',
      headerName: 'Available',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value <= 0
              ? 'error'
              : params.value <= params.row.reorderLevel
              ? 'warning'
              : 'success'
          }
        />
      )
    },
    { field: 'soldItems', headerName: 'Sold', width: 100 },
    { field: 'reservedItems', headerName: 'Reserved', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Out of Stock'
              ? 'error'
              : params.value === 'Low Stock'
              ? 'warning'
              : 'success'
          }
        />
      )
    },
    {
      field: 'amountSold',
      headerName: 'Revenue',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'lastRestockDate',
      headerName: 'Last Restock',
      width: 150,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A'
    }
  ];

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inventory Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Inventory
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{totalItems}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">In Stock</Typography>
              <Typography variant="h4" color="success.main">
                {items.filter((i) => i.status === 'In Stock').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Low Stock</Typography>
              <Typography variant="h4" color="warning.main">
                {items.filter((i) => i.status === 'Low Stock').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Out of Stock</Typography>
              <Typography variant="h4" color="error.main">
                {items.filter((i) => i.status === 'Out of Stock').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Search Inventory"
          variant="outlined"
          size="small"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={filter}
            label="Filter Status"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Low Stock">Low Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
          disableSelectionOnClick
        />
      </Box>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Inventory</DialogTitle>
        <DialogContent>
          <InventoryForm
            onSuccess={() => {
              setOpenForm(false);
              dispatch(fetchInventory({ page: 1 }));
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Inventory;
