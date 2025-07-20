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
  Box,
  Paper,
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
  Close as CloseIcon,
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={isSidebarOpen}
        onClose={handleDrawerToggle}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 300,
            boxSizing: 'border-box',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '0 24px 24px 0',
            overflow: 'hidden',
            
          },
        }}
        ModalProps={{
          keepMounted: true, // Keeps the sidebar mounted to improve performance
        }}
      >
        <div className="relative h-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
            }}></div>
          </div>

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* User Info */}
            <div className="mb-8 mt-2">
              <div className="flex items-center mb-6">
                <Box sx={{ position: 'relative', mr: 3 }}>
                  <Avatar 
                    sx={{
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, #ff6b6b, #ffa726)',
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {userName[0].toUpperCase()}
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
                </Box>
                <div>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}>
                    {userName}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem'
                  }}>
                    {userEmail}
                  </Typography>
                </div>
              </div>

              {/* Welcome Message */}
              <Paper sx={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                p: 2.5,
                color: 'white'
              }}>
                <Typography variant="body2" sx={{ 
                  textAlign: 'center',
                  fontWeight: 500,
                  lineHeight: 1.6
                }}>
                  Welcome back! Manage your account and explore your personalized dashboard.
                </Typography>
              </Paper>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <Typography variant="overline" sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                letterSpacing: '1px',
                ml: 2,
                mb: 2,
                display: 'block'
              }}>
                Account
              </Typography>
              
              <List sx={{ p: 0 }}>
                {menuItems.map((item, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleMenuItemClick(item.route)}
                    sx={{
                      mb: 1,
                      mx: 1,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { 
                        background: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(8px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'white',
                      minWidth: '40px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ 
                        color: 'white',
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ 
                my: 3, 
                mx: 2,
                borderColor: 'rgba(255,255,255,0.2)',
                '&::before, &::after': {
                  borderColor: 'rgba(255,255,255,0.2)'
                }
              }} />

              <Typography variant="overline" sx={{ 
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 600,
                letterSpacing: '1px',
                ml: 2,
                mb: 2,
                display: 'block'
              }}>
                Settings
              </Typography>

              {/* Settings Items */}
              <List sx={{ p: 0 }}>
                {settingsItems.map((item, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleMenuItemClick(item.route)}
                    sx={{
                      mb: 1,
                      mx: 1,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { 
                        background: 'rgba(255,255,255,0.15)',
                        transform: 'translateX(8px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'white',
                      minWidth: '40px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.25rem'
                      }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ 
                        color: 'white',
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ 
                my: 3, 
                mx: 2,
                borderColor: 'rgba(255,255,255,0.2)'
              }} />

              {/* Action Buttons */}
              <List sx={{ p: 0 }}>
                <ListItem
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                    navigate('/auth/login');
                    setIsSidebarOpen(false);
                  }}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    '&:hover': { 
                      background: 'rgba(239, 68, 68, 0.2)',
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#ff6b6b',
                    minWidth: '40px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem'
                    }
                  }}>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    sx={{ 
                      color: '#ff6b6b',
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                </ListItem>

                <ListItem
                  onClick={() => {
                    navigate('/auth/login');
                    setIsSidebarOpen(false);
                  }}
                  sx={{
                    mb: 1,
                    mx: 1,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    '&:hover': { 
                      background: 'rgba(59, 130, 246, 0.2)',
                      transform: 'translateX(8px)',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#3b82f6',
                    minWidth: '40px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.25rem'
                    }
                  }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sign In"
                    sx={{ 
                      color: '#3b82f6',
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                </ListItem>
              </List>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Hamburger Menu for Small Screens */}
      {!isSidebarOpen && (
        <div className="fixed top-10 left-6 z-[1000]">
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'scale(1.05) rotate(90deg)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
              },
            }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="h-full bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8 h-full">
            <Paper 
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                overflow: 'hidden'
              }}
            >
              <div className="h-full p-8">
                <Outlet />
              </div>
            </Paper>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Accounts;