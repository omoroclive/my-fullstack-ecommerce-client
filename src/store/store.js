import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice';
import cartReducer from './cart/cartSlice';
import savedItemsReducer from './savedItems/savedItemsSlice';
import recentlyViewedReducer from './recentlyViewed/recentlyViewedSlice';
import filterReducer from './filter/filterSlice';
import orderReducer from './order/orderSlice'; 
import inventoryReducer from './inventory/inventorySlice';
import expensesReducer from './expenses/expenseSlice';
import facebookReducer from './socialLogin/faceBookSlice';
import productsReducer from './product/productsSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    savedItems: savedItemsReducer,
    recentlyViewed: recentlyViewedReducer,
    filter: filterReducer,
    orders: orderReducer, 
    inventory: inventoryReducer,
    expenses: expensesReducer,
    facebook:facebookReducer,
    products:productsReducer
    
    
  }
});

export default store;
