import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { AppBar, Toolbar, Badge, IconButton, InputBase, Box, Avatar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/images/logo5.jpg";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const cartItems = useSelector((state) => state.cart.items) || [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          // Update URL search params
          setSearchParams({ q: query });
          // Call the search handler
          if (onSearch) {
            onSearch(query);
          }
          // Navigate to search results page if not already there
          navigate(`/shop/search?q=${encodeURIComponent(query)}`);
        } else {
          // Clear search params if query is empty
          setSearchParams({});
          if (onSearch) {
            onSearch("");
          }
        }
      }, 500), // Increased debounce time for better performance
    [onSearch, navigate, setSearchParams]
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Handle form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    debouncedSearch.cancel();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      if (onSearch) {
        onSearch(searchQuery);
      }
      navigate(`/shop/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", height: "40px", marginRight: "auto" }}
        />
        {/* Centered Search Bar */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 2,
              padding: "5px",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            <SearchIcon color="action" />
            <InputBase
              placeholder="Search products…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ marginLeft: 1, flex: 1 }}
            />
          </Box>
        </Box>
        {/* Cart Icon */}
        <IconButton aria-label="cart" color="inherit" onClick={() => navigate("/shop/cart")}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        {/* User Profile Section */}
        {isAuthenticated && user ? (
          <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/shop/account")}>
            <Avatar src={user.image || ""} alt={user.firstName || "User"} sx={{ width: 32, height: 32, marginRight: 1 }} />
            <Typography variant="body1" color="white">
              {user.firstName ? user.firstName : "User"}
            </Typography>
          </Box>
        ) : (
          <IconButton aria-label="account" color="inherit" onClick={() => navigate("/shop/account")}>
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

