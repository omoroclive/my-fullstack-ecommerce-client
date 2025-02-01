// filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: [],
  category: "",
  minPrice: 0,
  maxPrice: 10000,
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setBrandFilter(state, action) {
      state.brand = action.payload;
    },
    setCategoryFilter(state, action) {
      state.category = action.payload;
    },
    setPriceFilter(state, action) {
      state.minPrice = action.payload.minPrice;
      state.maxPrice = action.payload.maxPrice;
    },
    resetFilters(state) {
      state.brand = [];
      state.category = "";
      state.minPrice = 0;
      state.maxPrice = 10000;
    }
  }
});

export const { setBrandFilter, setCategoryFilter, setPriceFilter, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
