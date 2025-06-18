import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get token from localStorage
const token = localStorage.getItem("token");

// Fetch inventory
export const fetchInventory = createAsyncThunk("inventory/fetchInventory", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:3000/api/inventory" 
    || "https://ecommerce-server-c6w5.onrender.com/api/inventory", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Error fetching inventory");
  }
});

// Update inventory after order placement
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async ({ id, sold_items, amount_sold }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/inventory/${id}` || `https://ecommerce-server-c6w5.onrender.com/api/inventory/${id}`, 
        { sold_items, amount_sold },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch the latest inventory after updating
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
      .addCase(updateInventory.pending, (state) => {
        state.status = "loading"; // ✅ Indicate loading while updating inventory
      })
      .addCase(updateInventory.fulfilled, (state) => {
        state.status = "succeeded"; // ✅ Ensure UI updates after order placement
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;





