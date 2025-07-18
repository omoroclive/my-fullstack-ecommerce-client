import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Async thunks
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders`, getAuthHeaders());
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user orders');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/admin/all`, getAuthHeaders());
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { orderStatus },
        getAuthHeaders()
      );
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

// Initial state
const initialState = {
  userOrders: [],    // Orders for regular users
  adminOrders: [],   // All orders for admins
  loadingUser: false,
  loadingAdmin: false,
  updating: false,
  error: null,
  lastUpdated: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.userOrders = [];
      state.adminOrders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loadingUser = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.userOrders = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loadingUser = false;
        state.error = action.payload;
      })
      
      // Admin Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loadingAdmin = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loadingAdmin = false;
        state.adminOrders = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loadingAdmin = false;
        state.error = action.payload;
      })
      
      // Order Status Update
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;
        
        // Update in userOrders if present
        state.userOrders = state.userOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        );
        
        // Update in adminOrders if present
        state.adminOrders = state.adminOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;