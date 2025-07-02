import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch inventory
export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.get(`${BASE_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching inventory");
    }
  }
);

// Update inventory after order placement
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async ({ id, sold_items, amount_sold }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.put(
        `${BASE_URL}/api/inventory/${id}`,
        { sold_items, amount_sold },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh inventory after update
      dispatch(fetchInventory());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating inventory");
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update inventory
      .addCase(updateInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateInventory.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;
