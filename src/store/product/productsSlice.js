export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const token = localStorage.getItem("token");
  const backendURL = import.meta.env.VITE_API_BASE_URL;

  const res = await fetch(`${backendURL}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json(); // This should return { products: [...] }
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
        state.items = action.payload.products; // Make sure API response has this shape
        state.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productsSlice.reducer;
