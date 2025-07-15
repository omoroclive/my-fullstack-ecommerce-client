import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Email validation utility function
const validateEmail = (email) => {
  // Basic regex pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Check if email matches basic pattern
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }

  // Check for disposable/temporary email domains
  const disposableDomains = [
    'tempmail.com', 'mailinator.com', 'guerrillamail.com', 
    '10minutemail.com', 'fakeinbox.com', 'throwawaymail.com'
    // Add more disposable domains as needed
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.some(d => domain.includes(d))) {
    return { valid: false, message: "Disposable/temporary emails are not allowed" };
  }

  // Check for MX records (requires backend implementation)
  // This would be handled in your backend service
  
  return { valid: true };
};

// Enhanced registration thunk with email validation
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Frontend validation first
      const emailValidation = validateEmail(userData.email);
      if (!emailValidation.valid) {
        return rejectWithValue(emailValidation.message);
      }

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        ...userData,
        // Add additional metadata for verification
        registrationMetadata: {
          ipAddress: "", // Will be captured by backend
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      // If email verification is required
      if (response.data.requiresEmailVerification) {
        return { 
          ...response.data,
          message: "Verification email sent. Please check your inbox."
        };
      }

      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.data?.errorType === "EMAIL_VERIFICATION_REQUIRED") {
        return rejectWithValue("Please verify your email before logging in");
      }
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Email verification thunk
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
        token,
        email
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Email verification failed");
    }
  }
);

// Resend verification email thunk
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerification",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to resend verification email");
    }
  }
);

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  emailVerification: {
    sent: false,
    verified: false,
    loading: false
  }
};

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
    clearError: (state) => {
      state.error = null;
    },
    setEmailVerificationStatus: (state, action) => {
      state.emailVerification = {
        ...state.emailVerification,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    // Registration cases
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        if (action.payload.requiresEmailVerification) {
          state.emailVerification.sent = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Email verification cases
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.emailVerification.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.emailVerification.loading = false;
        state.emailVerification.verified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.emailVerification.loading = false;
        state.error = action.payload;
      });

    // Resend verification cases
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.emailVerification.loading = true;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.emailVerification.loading = false;
        state.emailVerification.sent = true;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.emailVerification.loading = false;
        state.error = action.payload;
      });

    // Login cases (unchanged from your original)
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

// Initialize auth state with token validation
export const initializeAuthState = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.user?.emailVerified === false) {
        dispatch(authSlice.actions.setEmailVerificationStatus({ sent: true, verified: false }));
      }
      
      dispatch(setUser({ user: response.data.user }));
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Token validation failed:", error);
    }
  }
};

export const { logout, setUser, loginUserSuccess, clearError, setEmailVerificationStatus } = authSlice.actions;
export default authSlice.reducer;