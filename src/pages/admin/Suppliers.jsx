import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Snackbar, Alert 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import SupplierForm from '../../components/SupplierForm';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/suppliers`);
        setSuppliers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((supplier) => supplier._id !== id));
      setSnackbar({ open: true, message: 'Supplier deleted successfully', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error deleting supplier', severity: 'error' });
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Suppliers
      </Typography>

      <SupplierForm setSuppliers={setSuppliers} />

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Date', 'Supplier Name', 'Quantity', 'Item Supplied', 'Amount Owed', 'Amount Paid', 'Actions'].map((head) => (
                <TableCell key={head} align="center" style={{ fontWeight: 'bold' }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell align="center">{supplier.date}</TableCell>
                <TableCell align="center">{supplier.supplierName}</TableCell>
                <TableCell align="center">{supplier.quantity}</TableCell>
                <TableCell align="center">{supplier.itemSupplied}</TableCell>
                <TableCell align="center">${supplier.amountOwed}</TableCell>
                <TableCell align="center">${supplier.amountPaid}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(supplier._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Suppliers;
