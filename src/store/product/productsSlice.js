import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const token = localStorage.getItem("token");

  const backendURL = import.meta.env.VITE_API_BASE_URL
    ? "https://ecommerce-server-c6w5.onrender.com"
    : "http://localhost:3000";

  const res = await fetch(`${backendURL}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log("API Response:", action.payload);
        state.items = action.payload.products; // Ensure backend returns products array
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productsSlice.reducer;

