import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array to store cart items
  totalQuantity: 0, // Total number of items in the cart
  totalAmount: 0, // Total price of all items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice += action.payload.price * action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          totalPrice: action.payload.price * action.payload.quantity,
        });
      }

      state.totalQuantity += action.payload.quantity;
      state.totalAmount += action.payload.price * action.payload.quantity;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const quantityDiff = quantity - existingItem.quantity;
        state.totalQuantity += quantityDiff;
        state.totalAmount += quantityDiff * existingItem.price;

        existingItem.quantity = quantity;
        existingItem.totalPrice = quantity * existingItem.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
