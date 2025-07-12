import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeInventory,
  resetInventoryError
} from '../store/inventory/inventorySlice';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material';

const InventoryForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.inventory);
  const [formData, setFormData] = useState({
    productId: '',
    openingStock: 0,
    supplier: '',
    reorderLevel: 5
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetInventoryError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'openingStock' || name === 'reorderLevel' ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(initializeInventory(formData))
      .unwrap()
      .then(() => onSuccess())
      .catch(() => {});
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        margin="normal"
        label="Product ID"
        name="productId"
        value={formData.productId}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Opening Stock"
        name="openingStock"
        type="number"
        value={formData.openingStock}
        onChange={handleChange}
        required
        inputProps={{ min: 0 }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Supplier"
        name="supplier"
        value={formData.supplier}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Reorder Level"
        name="reorderLevel"
        type="number"
        value={formData.reorderLevel}
        onChange={handleChange}
        inputProps={{ min: 1 }}
      />

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <CircularProgress size={24} />
          ) : (
            'Save Inventory'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryForm;