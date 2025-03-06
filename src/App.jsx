import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

// Admin Pages
import Dashboard from "./pages/admin/dashboard";
import Products from "./pages/admin/products";
import EditProductPage from "./pages/admin/edit-product";
import Features from "./pages/admin/features";
import Order from "./pages/admin/order";
import Employees from "./pages/admin/Employees";
import Suppliers from "./pages/admin/Suppliers";
import Inventory from "./pages/admin/Inventory";
import Expenses from "./pages/admin/Expenses";
import AddProductForm from "./pages/admin/AddProductForm";
import DataVisualization from "./pages/admin/DataVisualization";

// Shopping Pages
import Details from "./pages/shopping/details";
import Cart from "./pages/shopping/cart";
import Home from "./pages/shopping/home";
import Checkout from "./pages/shopping/checkout";
import Shopping from "./components/shopping/shopping";

// Account Pages

import Ratings from "./pages/account/Ratings";
import SavedItems from "./pages/account/SavedItems";
import RecentlyViewed from "./pages/account/RecentlyViewed";
import RecentlySearched from "./pages/account/RecentlySearched";
import Orders from "./pages/account/Orders";
import AddressBook from "./pages/account/AddressBook";
import AccountManagement from "./pages/account/AccountManagement";

// Auth Pages
import ForgotPassword from "./pages/auth/forgot-password";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Privacy from "./pages/auth/privacy";

// Layouts
import AdminLayout from "./components/admin/AdminLayout";
import ShoppingLayout from "./components/shopping/shoppingLayout";
import AuthLayout from "./components/auth/layout";
import Accounts from "./pages/shopping/Accounts";

// Common Components
import CheckAuth from "./components/common/check-auth";
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import ShopCategory from "./components/shopping/ShopCategory";
import ShopBrand from "./components/shopping/ShopBrand";
import GoogleAuthHandler from "./pages/auth/GoogleAuthHandler";
import SearchResults from "./components/shopping/searchResults";
import PrivacyPolicy from "./pages/auth/privacy";
import TermsAndConditions from "./pages/auth/TermsAndConditions";



function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  

  // Account Routes
  const accountRoutes = [
    { path: "ratings", element: <Ratings /> },
    { path: "saved", element: <SavedItems /> },
    { path: "viewed", element: <RecentlyViewed /> },
    { path: "searched", element: <RecentlySearched /> },
    { path: "orders", element: <Orders /> },
    { path: "address", element: <AddressBook /> },
    { path: "management", element: <AccountManagement /> },
    
  ];

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsAndConditions />} />

      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <CheckAuth
            isAuthenticated={isAuthenticated}
            user={user}
            allowedRoles={["admin"]}
          >
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/features" element={<Features />} />
        <Route path="dashboard/orders" element={<Order />} />
        <Route path="dashboard/products" element={<Products />} />
        <Route path="dashboard/edit-product/:productId" element={<EditProductPage />} />
        <Route path="dashboard/employees" element={<Employees />} />
        <Route path="dashboard/suppliers" element={<Suppliers />} />
        <Route path="dashboard/inventory" element={<Inventory />} />
        <Route path="dashboard/expenses" element={<Expenses />} />
        <Route path="dashboard/add-product" element={<AddProductForm />} />
        <Route path="dashboard/data-visualization" element={<DataVisualization />} />
      </Route>

      {/* Shopping Routes */}
      <Route
        path="/shop"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="shopping" element={<Shopping />} />
        <Route path="details/:id" element={<Details />} />
        <Route path="cart" element={<Cart />} />
        <Route path="account" element={<Accounts />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="categories/:category" element={<ShopCategory/>} />
        <Route path="brands/:brand" element={<ShopBrand />} /> 
        <Route path="search" element={<SearchResults />} />


      </Route>

      {/* Account Routes */}
      <Route path="/account" element={<Accounts />}>
        {accountRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Misc Routes */}
      <Route path="*" element={<NotFound />} />
      <Route path="/unauth-page" element={<UnauthPage />} />
    </Routes>
  );
}

export default App;
