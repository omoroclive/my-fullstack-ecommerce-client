import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Accounts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email') || 'guest@example.com';
  const userName = userEmail.split('@')[0];

  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (route) => {
    navigate(route);
    setIsSidebarOpen(false); // Close the sidebar after clicking a menu item
  };

  const menuItems = [
    { text: 'My Account', icon: <PersonIcon />, route: '/account' },
    { text: 'Ratings & Reviews', icon: <StarIcon />, route: '/account/ratings' },
    { text: 'Saved Items', icon: <FavoriteIcon />, route: '/account/saved' },
    { text: 'Recently Viewed', icon: <HistoryIcon />, route: '/account/viewed' },
    { text: 'Recently Searched', icon: <SearchIcon />, route: '/account/searched' },
    { text: 'My Orders', icon: <ShoppingBagIcon />, route: '/account/orders' },
  ];

  const settingsItems = [
    { text: 'Address Book', icon: <HomeIcon />, route: '/account/address' },
    { text: 'Account Management', icon: <SettingsIcon />, route: '/account/management' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isSidebarOpen}
        onClose={handleDrawerToggle}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#2D3748',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          },
        }}
        ModalProps={{
          keepMounted: true, // Keeps the sidebar mounted to improve performance
        }}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center mb-8">
            <Avatar className="mr-4 bg-indigo-600 text-white">
              {userName[0].toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="h6" className="font-semibold text-lg">
                Welcome, {userName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userEmail}
              </Typography>
            </div>
          </div>

          {/* Menu Items */}
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleMenuItemClick(item.route)}
                sx={{
                  '&:hover': { backgroundColor: '#4A5568' },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: 'white' }}
                />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3, borderColor: '#4A5568' }} />

          {/* Settings Items */}
          <List>
            {settingsItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleMenuItemClick(item.route)}
                sx={{
                  '&:hover': { backgroundColor: '#4A5568' },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: 'white' }}
                />
              </ListItem>
            ))}
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("email");
                // dispatch(logout()); // Optional: reset Redux auth state
                navigate('/auth/login');
                setIsSidebarOpen(false);
              }}
              sx={{
                '&:hover': { backgroundColor: '#E53E3E' },
              }}
            >
              <ListItemIcon sx={{ color: '#E53E3E' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ color: '#E53E3E' }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                navigate('/auth/login');
                setIsSidebarOpen(false);
              }}
              sx={{
                '&:hover': { backgroundColor: '#3182CE' },
              }}
            >
              <ListItemIcon sx={{ color: '#3182CE' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sign In"
                sx={{ color: '#3182CE' }}
              />
            </ListItem>
          </List>
        </div>
      </Drawer>

      {/* Hamburger Menu for Small Screens */}
      {!isSidebarOpen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            color: 'white',
            backgroundColor: '#2D3748',
            '&:hover': { backgroundColor: '#4A5568' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Accounts;
