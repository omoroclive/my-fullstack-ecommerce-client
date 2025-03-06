import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  const res = await fetch("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`, // Pass token in header
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
        console.log("API Response:", action.payload); // Debugging
        state.items = action.payload.products; //  Ensure this is an array
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      }); 
  },
});

export default productsSlice.reducer;

