import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../../store/expenses/expenseSlice';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses, status, error } = useSelector((state) => state.expenses);

  const [newExpense, setNewExpense] = useState({
    expenses_name: '',
    expenses_amount: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    if (newExpense.expenses_name && newExpense.expenses_amount) {
      dispatch(addExpense(newExpense));
      setNewExpense({ expenses_name: '', expenses_amount: '' });
      setNotification({ open: true, message: 'Expense added successfully!', severity: 'success' });
    } else {
      setNotification({ open: true, message: 'Please fill in all fields.', severity: 'warning' });
    }
  };

  const handleEditExpense = (id) => {
    setEditMode(true);
    const expense = expenses.find((exp) => exp._id === id);
    setNewExpense({
      expenses_name: expense.expenses_name,
      expenses_amount: expense.expenses_amount,
    });
    setCurrentExpenseId(id);
  };

  const handleSaveEdit = () => {
    if (newExpense.expenses_name && newExpense.expenses_amount) {
      dispatch(updateExpense({ id: currentExpenseId, expenseData: newExpense }));
      setEditMode(false);
      setNewExpense({ expenses_name: '', expenses_amount: '' });
      setCurrentExpenseId(null);
      setNotification({ open: true, message: 'Expense updated successfully!', severity: 'success' });
    } else {
      setNotification({ open: true, message: 'Please fill in all fields.', severity: 'warning' });
    }
  };

  const handleDeleteExpense = (id) => {
    dispatch(deleteExpense(id));
    setNotification({ open: true, message: 'Expense deleted successfully!', severity: 'info' });
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Expense Management
      </Typography>
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
        <TextField
          label="Expense Name"
          name="expenses_name"
          value={newExpense.expenses_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          name="expenses_amount"
          type="number"
          value={newExpense.expenses_amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {editMode ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveEdit}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddExpense}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Add Expense
          </Button>
        )}
      </Paper>
      {status === 'loading' && <CircularProgress />}
      {status === 'failed' && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Expense Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Revenue Generated</TableCell>
              <TableCell>Revenue Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{expense.expenses_name}</TableCell>
                <TableCell>${expense.expenses_amount.toFixed(2)}</TableCell>
                <TableCell>${expense.revenue_generated.toFixed(2)}</TableCell>
                <TableCell>${expense.revenue_balance.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditExpense(expense._id)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteExpense(expense._id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Expenses;
