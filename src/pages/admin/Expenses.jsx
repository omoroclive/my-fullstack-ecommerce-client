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
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '& th': {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontWeight: 600,
  textTransform: 'none',
}));

const ExpensePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)',
}));

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Expense Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track and manage your organization's expenses
        </Typography>
      </Box>

      <ExpensePaper>
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          {editMode ? 'Edit Expense' : 'Add New Expense'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Expense Name"
              name="expenses_name"
              value={newExpense.expenses_name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Amount ($)"
              name="expenses_amount"
              type="number"
              value={newExpense.expenses_amount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
        </Grid>
        {editMode ? (
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            fullWidth
            startIcon={<SaveIcon />}
          >
            Save Changes
          </ActionButton>
        ) : (
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleAddExpense}
            fullWidth
            startIcon={<AddIcon />}
          >
            Add Expense
          </ActionButton>
        )}
      </ExpensePaper>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)' }}>
        <TableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>Expense Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Revenue Generated</TableCell>
                <TableCell align="right">Revenue Balance</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow 
                  key={expense._id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography fontWeight={500}>
                      {expense.expenses_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    ${expense.expenses_amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${expense.revenue_generated.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${expense.revenue_balance.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={() => handleEditExpense(expense._id)} 
                      aria-label="edit"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteExpense(expense._id)} 
                      aria-label="delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%' }}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Expenses;