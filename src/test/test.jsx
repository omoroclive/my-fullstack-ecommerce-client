  
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/auth/register", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Registration failed");
        }
    }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3000/auth/login", loginData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Login failed");
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        // Handle registerUser
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // Handle loginUser
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;  
                state.isAuthenticated = true;
              })
              
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Actions
export const { logout } = authSlice.actions;

export default authSlice.reducer;


/*
.sidebar {
    z-index: 40; 
  }
  
  /*.header {
    z-index: 50; /* Above everything else 
  }
  .overlay {
    z-index: 30; /* Below sidebar 
  }
    
  .content {
    padding-left: 16rem; /* Sidebar width 
  }
  
  @media (max-width: 768px) {
    .content {
      padding-left: 0;
    }
  }*/
    import React from 'react'
    import Header from './header'
    import Sidebar from './sidebar'
    import { Outlet } from 'react-router-dom'
    
    function AdminLayout() {
      console.log('Layout rendered');
      return (
        <div className="admin-layout">
          <Sidebar />
          <div className="content">
            <Header />
            <main>
              <Outlet /> {/* This is where nested routes will render */}
            </main>
          </div>
        </div>
      );
    }

    function AdminLayout() {
        return (
          <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
      
            {/* Main Content */}
            <div className="flex flex-col flex-grow">
              {/* Header */}
              <Header />
      
              {/* Main Content Area */}
              <main className="flex-grow p-4 bg-gray-100 overflow-y-auto">
                <Outlet /> {/* This is where nested routes will render */}
              </main>
            </div>
          </div>
        );
      }
/*
.content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  main {
    flex-grow: 1;
    padding: 1rem;
    background-color: #f3f4f6; /* Tailwind's bg-gray-100 
    overflow-y: auto;
  }
  */

  import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/auth/login');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md z-50">
      {/* Logo and Title */}
      <div className="flex items-center">
        <div className="bg-white rounded-full h-10 w-10 flex justify-center items-center text-blue-600 font-bold shadow">
          A
        </div>
        <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Single Logout Button */}
      <Button
        variant="contained"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        className="capitalize"
      >
        Logout
      </Button>
    </header>
  );
};

/*export default Header;}*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Menu */}
      <div className="absolute top-4 left-4 md:hidden z-60">
        <button
          onClick={toggleSidebar}
          className="hover:bg-blue-700 bg-black text-white p-2 rounded"
        >
          {isOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-700 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-40 md:relative md:translate-x-0`}
      >
        <nav>
          <ul className="space-y-4 p-4">
            <li>
              <Link to="/admin/dashboard" className="block hover:bg-blue-500 p-2 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/products" className="block hover:bg-blue-500 p-2 rounded">
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/invoices" className="block hover:bg-blue-500 p-2 rounded">
                Invoices
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/features" className="block hover:bg-blue-500 p-2 rounded">
                Features
              </Link>
            </li>
            <li>
              <Link to="/admin/dashboard/orders" className="block hover:bg-blue-500 p-2 rounded">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          className="fixed inset-0 overlay md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

/*export default Sidebar;*/

import React from 'react';
/*import Header from './header';
import Sidebar from './sidebar';*/
import { Outlet } from 'react-router-dom';

function AdminLayout() {
      console.log('Layout rendered');
      return (
        <div className="admin-layout">
          <Sidebar />
          <div className="content">
            <Header />
            <main>
              <Outlet /> {/* This is where nested routes will render */}
            </main>
          </div>
        </div>
      );
    }
/*export default AdminLayout;*/



  
    
import React, { useState } from "react";
import { Button } from "@mui/material";

function CommonForm({ formControls, onSubmit, submitButtonText = "Submit" }) {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(formControls.map((control) => [control.name, ""]))
  );

  const handleChange = (name) => (event) => {
    const value = event.target.type === "file" ? event.target.files : event.target.value;
    setFormValues({ ...formValues, [name]: value });
  };

  const renderInputsByComponentType = (control) => {
    if (control.componentType === "file") {
      return (
        <div key={control.name} style={{ marginBottom: "16px" }}>
          <label>{control.label}</label>
          <input
            type="file"
            name={control.name}
            multiple={control.multiple || false}
            onChange={handleChange(control.name)}
          />
        </div>
      );
    }

    const ComponentType = control.componentType;
    return (
      <div key={control.name} style={{ marginBottom: "16px" }}>
        <ComponentType
          label={control.label}
          placeholder={control.placeholder}
          type={control.type || "text"}
          variant="outlined"
          fullWidth
          value={formValues[control.name]}
          onChange={handleChange(control.name)}
        />
      </div>
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      // Prepare FormData for submission
      const formData = new FormData();
      for (const [key, value] of Object.entries(formValues)) {
        if (key === "images") {
          Array.from(value).forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, value);
        }
      }
      onSubmit(formData); // Pass FormData to the callback
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render form controls */}
      {formControls.map((control) => renderInputsByComponentType(control))}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button variant="contained" color="primary" type="submit">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

/*export default CommonForm;*/

const Product = require('../../config/model/product');
const { uploadImage, deleteImage } = require('../../helpers/cloudinary');

// Add Product Controller
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !brand || !price || !totalStock) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Handle image uploads
    const imageFiles = req.files; // Assuming images are passed as "files" in the request
    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    // Image upload logic to Cloudinary
    const images = [];
    for (const file of imageFiles) {
      try {
        const uploadResult = await uploadImage(file.path, 'products');
        images.push({ url: uploadResult.url, publicId: uploadResult.publicId });
      } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }

    // Create the product
    const product = new Product({
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      images,
    });

    // Save the product to the database
    const savedProduct = await product.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Product Controller
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      try {
        await deleteImage(image.publicId);
      } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ message: 'Error deleting images from Cloudinary' });
      }
    }

    // Delete the product from the database
    await product.remove();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addProduct,
  deleteProduct,
};


import React, { useState } from "react";
import {
  Button,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { addProductFormElements } from "../../config/addProductElement";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      setNotification({ open: true, message: "No authentication token found", severity: "error" });
      return;
    }

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < formData.images.length; i++) {
          formDataToSubmit.append("images", formData.images[i]);
        }
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNotification({ open: true, message: "Product added successfully!", severity: "success" });
      console.log(response.data);
      setFormData({
        title: "",
        description: "",
        category: "",
        brand: "",
        price: "",
        salePrice: "",
        totalStock: "",
        images: [],
      });
    } catch (error) {
      setNotification({ open: true, message: "Failed to add product. Please try again.", severity: "error" });
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {addProductFormElements.map((field) => {
          if (field.componentType === "input") {
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                fullWidth
                margin="normal"
              />
            );
          }
          if (field.componentType === "textarea") {
            return (
              <TextareaAutosize
                key={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                style={{ width: "100%", margin: "10px 0", padding: "8px" }}
              />
            );
          }
          if (field.componentType === "select") {
            return (
              <FormControl fullWidth margin="normal" key={field.name}>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  fullWidth
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          if (field.componentType === "file") {
            return (
              <TextField
                key={field.name}
                label={field.label}
                name={field.name}
                type="file"
                inputProps={{ multiple: true }}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            );
          }
          return null;
        })}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}
        </Button>
      </form>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

/*export default AddProductForm;*/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

const AccountMain = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state for mobile
  const userEmail = localStorage.getItem("email") || "guest@example.com"; // Fallback to guest email
  const userName = userEmail.split("@")[0]; // Extract name from email
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const handleSignIn = () => {
    navigate("/auth/login");
  };

  const menuItems = [
    { text: "My Account", icon: <PersonIcon />, route: "/account" },
    { text: "Ratings & Reviews", icon: <StarIcon />, route: "/account/ratings" },
    { text: "Saved Items", icon: <FavoriteIcon />, route: "/account/saved" },
    { text: "Recently Viewed", icon: <HistoryIcon />, route: "/account/viewed" },
    { text: "Recently Searched", icon: <SearchIcon />, route: "/account/searched" },
    { text: "My Orders", icon: <ShoppingBagIcon />, route: "/account/orders" },
  ];

  const settingsItems = [
    { text: "Address Book", icon: <HomeIcon />, route: "/account/address" },
    { text: "Account Management", icon: <SettingsIcon />, route: "/account/management" },
  ];

  return (
    <div className="flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 p-4 bg-gray-100 border-r shadow-lg">
        {/* User Greeting */}
        <div className="flex items-center mb-6">
          <Avatar className="mr-4 bg-blue-500">{userName[0].toUpperCase()}</Avatar>
          <div>
            <h2 className="text-lg font-semibold">Welcome, {userName}</h2>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.route)}
              className="hover:bg-blue-100 rounded"
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {/* Divider */}
        <hr className="my-4" />

        {/* Settings Items */}
        <List>
          {settingsItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.route)}
              className="hover:bg-blue-100 rounded"
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          <ListItem
            button
            onClick={handleLogout}
            className="hover:bg-blue-100 rounded text-red-600"
          >
            <ListItemIcon>
              <ExitToAppIcon className="text-red-600" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
          <ListItem
            button
            onClick={handleSignIn}
            className="hover:bg-blue-100 rounded text-blue-600"
          >
            <ListItemIcon>
              <LoginIcon className="text-blue-600" />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItem>
        </List>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
      </main>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          style: {
            width: "250px",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 12px",
          },
        }}
      >
        <div className="p-4">
          {/* User Greeting */}
          <div className="flex items-center mb-6">
            <Avatar className="mr-4 bg-blue-500">{userName[0].toUpperCase()}</Avatar>
            <div>
              <h2 className="text-lg font-semibold">Welcome, {userName}</h2>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>

          {/* Menu Items */}
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.route);
                  setIsDrawerOpen(false);
                }}
                className="hover:bg-blue-100 rounded"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          {/* Divider */}
          <hr className="my-4" />

          {/* Settings Items */}
          <List>
            {settingsItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.route);
                  setIsDrawerOpen(false);
                }}
                className="hover:bg-blue-100 rounded"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => {
                handleLogout();
                setIsDrawerOpen(false);
              }}
              className="hover:bg-blue-100 rounded text-red-600"
            >
              <ListItemIcon>
                <ExitToAppIcon className="text-red-600" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleSignIn();
                setIsDrawerOpen(false);
              }}
              className="hover:bg-blue-100 rounded text-blue-600"
            >
              <ListItemIcon>
                <LoginIcon className="text-blue-600" />
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      {/* Hamburger Menu for Mobile */}
      <IconButton
        className="fixed top-4 left-4 md:hidden"
        onClick={() => setIsDrawerOpen(true)}
      >
        <MenuIcon />
      </IconButton>
    </div>
  );
};

/*export default AccountMain;*/

import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';

function CommonForm({ formControls, onSubmit, submitButtonText = 'Submit' }) {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(formControls.map((control) => [control.name, '']))
  );

  const handleChange = (name) => (event) => {
    const value =
      event.target.type === 'file' ? event.target.files : event.target.value;
    setFormValues({ ...formValues, [name]: value });
  };

  const renderInputsByComponentType = (control) => {
    // Check if the control has a custom componentType (like TextField, Select, etc.)
    const Component = control.componentType;
    switch (control.componentType) {
      case TextField:
        return (
          <Component
            key={control.name}
            label={control.label}
            placeholder={control.placeholder}
            type={control.type}
            variant="outlined"
            fullWidth
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            style={{ marginBottom: '16px' }}
          />
        );
      case 'textarea':
        return (
          <TextareaAutosize
            key={control.name}
            minRows={3}
            placeholder={control.placeholder}
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            style={{
              width: '100%',
              marginBottom: '16px',
              padding: '8px',
              borderColor: '#ccc',
              borderRadius: '4px',
            }}
          />
        );
      case 'select':
        return (
          <Select
            key={control.name}
            value={formValues[control.name]}
            onChange={handleChange(control.name)}
            displayEmpty
            fullWidth
            variant="outlined"
            style={{ marginBottom: '16px' }}
          >
            <MenuItem value="" disabled>
              {control.placeholder}
            </MenuItem>
            {control.options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        );
      case 'file':
        return (
          <input
            key={control.name}
            type="file"
            multiple={control.multiple}
            onChange={handleChange(control.name)}
            style={{ marginBottom: '16px', display: 'block' }}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render form controls */}
      {formControls.map((control) => renderInputsByComponentType(control))}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button variant="contained" color="primary" type="submit">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

/*export default CommonForm;*/

//MPESA_CALLBACK_URL=https://your-ngrok-url/callback

//MPESA_CALLBACK_URL=http://localhost:3000/api/mpesa/callback

const express = require("express");
const router = express.Router();
const { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrderStatus, 
    deleteOrder 
} = require("../../controllers/orders/orders-controller") ;
const authMiddleware = require("../../middleware/authMiddleware"); 
const Inventory = require("../../config/model/inventory");

// Create a new order
router.post("/", authMiddleware, createOrder);

// Get all orders for the logged-in user
router.get("/", authMiddleware, getOrders);

// Get a single order by ID
router.get("/:id", authMiddleware, getOrderById);

// Update order status
router.patch("/:id/status", authMiddleware, updateOrderStatus);

// Delete an order
router.delete("/:id", authMiddleware, deleteOrder);



// Inside order creation route
const updateInventory = async (orderItems) => {
  for (const item of orderItems) {
    const inventory = await Inventory.findOne({ brand: item.brand, category: item.category });

    if (inventory) {
      inventory.sold_items += item.quantity;
      inventory.balance_stock -= item.quantity;
      inventory.amount_sold += item.quantity * item.price;
      await inventory.save();
    }
  }
};


module.exports = router;