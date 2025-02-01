import { createSlice } from "@reduxjs/toolkit";

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: [],
  reducers: {
    addToRecentlyViewed: (state, action) => {
      const { id } = action.payload;

      // Check if the product already exists in the list
      const exists = state.find((product) => product.id === id);

      if (!exists) {
        // Add the new product at the beginning of the list
        state.unshift(action.payload);

        // Limit the list to 10 items
        if (state.length > 10) {
          state.pop();
        }
      }
    },
  },
});

export const { addToRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
