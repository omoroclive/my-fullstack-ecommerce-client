import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import {
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
  const isMobile = useMediaQuery("(max-width:600px)");

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        if (query.trim()) {
          setSearchParams({ q: query });
          if (onSearch) onSearch(query);
          navigate(`/shop/search?q=${encodeURIComponent(query)}`);
        } else {
          setSearchParams({});
          if (onSearch) onSearch("");
        }
      }, 500),
    [onSearch, navigate, setSearchParams]
  );

  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    debouncedSearch.cancel();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      if (onSearch) onSearch(searchQuery);
      navigate(`/shop/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Logo"
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            height: 40,
            mr: 2,
          }}
        />

        {/* Search */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <SearchIcon color="action" />
            <InputBase
              placeholder="Search products…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
          </Box>
        </Box>

        {/* Cart + Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton aria-label="cart" color="inherit" onClick={() => navigate("/shop/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {isAuthenticated && user ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/shop/account")}
            >
              <Avatar
                src={user.image || ""}
                alt={user.firstName || "User"}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              {!isMobile && (
                <Typography variant="body1" color="white" sx={{ fontSize: "0.9rem" }}>
                  {user.firstName || "User"}
                </Typography>
              )}
            </Box>
          ) : (
            <IconButton aria-label="account" color="inherit" onClick={() => navigate("/shop/account")}>
              <AccountCircleIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
