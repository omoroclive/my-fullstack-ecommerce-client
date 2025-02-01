import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Snackbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const EditProductPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
    images: [],
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
        setFormData(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
        setSnackbarMessage('Error fetching product');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbarMessage('Unauthorized. Please log in.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'images') {
        for (const file of formData.images) {
          formDataToSend.append('images', file);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      await axios.put(`http://localhost:3000/api/products/${productId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage('Product updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbarMessage('Error updating product');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container justifyContent="center" style={{ padding: '2rem' }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Edit Product
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Title"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Brand"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sale Price"
                    name="salePrice"
                    type="number"
                    value={formData.salePrice || ''}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Total Stock"
                    name="totalStock"
                    type="number"
                    value={formData.totalStock || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    Upload Images
                  </Typography>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFormData({ ...formData, images: e.target.files })}
                  />
                </Grid>
              </Grid>
              <CardActions style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ minWidth: '150px' }}
                >
                  Update Product
                </Button>
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default EditProductPage;

