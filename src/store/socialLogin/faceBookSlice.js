// auth-slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add this new action
export const socialLogin = createAsyncThunk(
  'auth/socialLogin',
  async (socialData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/social-login', socialData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const facebookSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    // ... your existing reducers
  },
  extraReducers: (builder) => {
    builder
      // ... your existing login cases
      .addCase(socialLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Social login failed';
      });
  },
});

export default facebookSlice.reducer;