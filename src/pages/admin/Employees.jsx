import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const EmployeeForm = ({ employees, setEmployees }) => {
  const [formData, setFormData] = useState({ name: '', role: '', salary: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.salary) {
      setError('All fields are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/employees' || "https://ecommerce-server-c6w5.onrender.com/api/employees", formData);
      const newEmployee = res.data;
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
      setFormData({ name: '', role: '', salary: '' });
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error adding employee. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h5" gutterBottom align="center">
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
              <Button type="submit" variant="contained" color="secondary" fullWidth>
                Add Employee
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/employees');
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/employees/${id}`);
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Employees
      </Typography>

      <EmployeeForm employees={employees} setEmployees={setEmployees} />

      <Paper elevation={3} style={{ marginTop: '20px', padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h6" align="center" gutterBottom>
          Employees
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#333' }}>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Salary</TableCell>
                <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee._id}>
                  <TableCell align="center">{employee.name}</TableCell>
                  <TableCell align="center">{employee.role}</TableCell>
                  <TableCell align="center">${employee.salary}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(employee._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Employees;


