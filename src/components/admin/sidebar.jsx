import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  AddCircle as AddCircleIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  AccountBalance as AccountBalanceIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Check if screen is large

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, route: "/admin/dashboard" },
    { text: "Products", icon: <InventoryIcon />, route: "/admin/dashboard/products" },
    { text: "Add Product", icon: <AddCircleIcon />, route: "/admin/dashboard/add-product" },
    { text: "Orders", icon: <ShoppingCartIcon />, route: "/admin/dashboard/orders" },
    { text: "Analytics", icon: <AnalyticsIcon />, route: "/admin/dashboard/analytics" },
    { text: "Reviews", icon: <StarIcon />, route: "/admin/dashboard/reviews" },
    { text: "Expenses", icon: <AttachMoneyIcon />, route: "/admin/dashboard/expenses" },
    { text: "Employees", icon: <PeopleIcon />, route: "/admin/dashboard/employees" },
    { text: "Suppliers", icon: <LocalShippingIcon />, route: "/admin/dashboard/suppliers" },
    { text: "Invoices", icon: <DescriptionIcon />, route: "/admin/dashboard/invoices" },
    { text: "Inventory", icon: <InventoryIcon />, route: "/admin/dashboard/inventory" },
    {text:  "DataVisualization", icon: <DashboardIcon />, route: "/admin/dashboard/data-visualization"},
    { text: "Settings", icon: <SettingsIcon />, route: "/admin/dashboard/settings" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <Drawer
      variant={isLargeScreen ? "permanent" : "temporary"} // Switch between permanent and temporary
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#1c1c1c", // Gray background color
          color: "white",
        },
      }}
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
    >
      {/* Sidebar Header */}
      <div className="flex flex-col items-center justify-center py-6">
        <Avatar sx={{ bgcolor: "#gray-900", width: 56, height: 56 }}>
          A
        </Avatar>
        <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
          Admin Panel
        </Typography>
      </div>

      {/* Close Button for Mobile View */}
      {!isLargeScreen && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "red",
          }}
        >
          X
        </IconButton>
      )}

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.route)}
            sx={{
              "&:hover": {
                backgroundColor: "#2e2e2e", // Hover color
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <List sx={{ marginTop: "auto" }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            "&:hover": {
              backgroundColor: "#2e2e2e",
            },
            color: "red",
          }}
        >
          <ListItemIcon sx={{ color: "red" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;




