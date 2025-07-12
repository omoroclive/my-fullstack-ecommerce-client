import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper: Auth headers
const getAuthConfig = (getState, contentType = 'application/json', params = {}) => {
  const { userInfo } = getState().auth;
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
      'Content-Type': contentType,
    },
    params,
  };
};

// Fetch Inventory
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async ({ page = 1, search = '', status }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState, 'application/json', { page, search, status });
      const { data } = await axios.get(`${API_BASE_URL}/api/inventory`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initialize Inventory
export const initializeInventory = createAsyncThunk(
  'inventory/initializeInventory',
  async (inventoryData, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await axios.post(`${API_BASE_URL}/api/inventory`, inventoryData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Inventory Item
export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventory',
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await axios.put(`${API_BASE_URL}/api/inventory/${id}`, updateData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get Low Stock Items
export const getLowStockItems = createAsyncThunk(
  'inventory/getLowStock',
  async (_, { getState, rejectWithValue }) => {
    try {
      const config = getAuthConfig(getState);
      const { data } = await axios.get(`${API_BASE_URL}/api/inventory/low-stock`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Inventory Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    lowStockItems: [],
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  reducers: {
    resetInventoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inventory
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.inventory;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Initialize Inventory
      .addCase(initializeInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload.inventory);
        state.totalItems += 1;
      })
      .addCase(initializeInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Inventory
      .addCase(updateInventoryItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(
          item => item._id === action.payload.inventory._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.inventory;
        }
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Get Low Stock Items
      .addCase(getLowStockItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLowStockItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lowStockItems = action.payload.items;
      })
      .addCase(getLowStockItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
