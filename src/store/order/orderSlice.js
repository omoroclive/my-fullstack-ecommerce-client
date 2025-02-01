import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get token from localStorage (adjust according to your token storage method)
const token = localStorage.getItem('token');

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get('http://localhost:3000/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`, // Include token in header
    },
  });

   
  return response.data; 
});

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }) => {
    const response = await axios.put(
      `http://localhost:3000/api/orders/${orderId}`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in header
        },
      }
    );
    return response.data; // return the updated order
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index].status = updatedOrder.status;
        }
      });
  },
});

export default orderSlice.reducer;



