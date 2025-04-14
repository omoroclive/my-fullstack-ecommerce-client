import React, { useState } from 'react';
import { Button, TextField, Grid, Container, Typography, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = "http://localhost:3000" || "https://grateful-adventure-production.up.railway.app";

const SupplierForm = ({ setSuppliers }) => {
  const [formData, setFormData] = useState({
    date: '',
    supplierName: '',
    quantity: '',
    itemSupplied: '',
    amountOwed: '',
    amountPaid: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.supplierName || !formData.quantity || !formData.itemSupplied || !formData.amountOwed || !formData.amountPaid) {
      setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }
  
    try {
      const res = await axios.post(`${API_URL}/api/suppliers`, formData);
      // Update the supplier list with the new supplier
      setSuppliers((prevSuppliers) => [...prevSuppliers, res.data.supplier]);
      setSnackbar({ open: true, message: 'Supplier added successfully!', severity: 'success' });
      setFormData({ date: '', supplierName: '', quantity: '', itemSupplied: '', amountOwed: '', amountPaid: '' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error adding supplier. Please try again.', severity: 'error' });
    }
  };
  

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Add Supplier
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Supplier Name"
                variant="outlined"
                fullWidth
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Item Supplied"
                variant="outlined"
                fullWidth
                value={formData.itemSupplied}
                onChange={(e) => setFormData({ ...formData, itemSupplied: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Amount Owed"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.amountOwed}
                onChange={(e) => setFormData({ ...formData, amountOwed: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Amount Paid"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.amountPaid}
                onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Supplier
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupplierForm;

