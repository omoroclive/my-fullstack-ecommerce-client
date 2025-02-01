import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of saved items
};

const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState,
  reducers: {
    addToSavedItems: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeFromSavedItems: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToSavedItems, removeFromSavedItems } = savedItemsSlice.actions;

export default savedItemsSlice.reducer;
