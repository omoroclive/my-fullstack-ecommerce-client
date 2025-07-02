// store/expense/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get token from localStorage
const token = localStorage.getItem("token");

// Define base URL from environment or fallback to localhost
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Fetch expenses
export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching expenses");
    }
  }
);

// Add expense
export const addExpense = createAsyncThunk(
  "expense/addExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/expenses`, expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding expense");
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/expenses/${id}`,
        expenseData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating expense");
    }
  }
);

// Delete expense
export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // Return the id of the deleted expense to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting expense");
    }
  }
);

const initialState = {
  expenses: [],
  status: "idle",
  error: null,
};

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex((exp) => exp._id === action.payload._id);
        if (index >= 0) state.expenses[index] = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
      });
  },
});

export default expenseSlice.reducer;
