import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Container, Typography, Paper, Snackbar, Alert } from '@mui/material';

const API_URL = "http://localhost:3000" || "https://grateful-adventure-production.up.railway.app";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({ name: '', role: '', salary: '' });
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.salary) {
      setError('All fields are required.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/employees`, formData);
      setSnackbar({ open: true, message: 'Employee added successfully!', severity: 'success' });
      setFormData({ name: '', role: '', salary: '' });
      setError('');
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error adding employee. Please try again.', severity: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Add Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Role"
                variant="outlined"
                fullWidth
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Salary"
                variant="outlined"
                fullWidth
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeForm;
