 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use environment variable for base URL
const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);

      const user = response.data?.user;
      const token = response.data?.accessToken;

      if (user && user.role && token) {
        return { user, token };
      } else {
        return rejectWithValue("Invalid login response: user or token missing");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Check for stored token during app initialization
export const initializeAuthState = () => (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    axios
      .get(`${API_BASE_URL}/auth/validate-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(setUser({ user: response.data.user }));
      })
      .catch((error) => {
        localStorage.removeItem("token");
        console.error("Token validation failed:", error);
      });
  }
};

// Actions
export const { logout, setUser, loginUserSuccess } = authSlice.actions;

export default authSlice.reducer;