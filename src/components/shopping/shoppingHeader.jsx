import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // To get cart state
import { AppBar, Toolbar, Badge, IconButton, InputBase, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import logo from "../../assets/images/logo5.jpg";

const Navbar = () => {
  const navigate = useNavigate();

  // Fetch cart count from Redux store
  const cartItems = useSelector((state) => state.cart.items); // Assuming `cart.items` holds an array of cart items
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Custom styling for the search bar
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            height: "40px",
            marginRight: "auto",
          }}
        />

        {/* Centered Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>

        {/* Cart Icon */}
        <IconButton
          aria-label="cart"
          color="inherit"
          onClick={() => navigate("/shop/cart")}
        >
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Account Icon */}
        <IconButton
          aria-label="account"
          color="inherit"
          onClick={() => navigate("/shop/account")}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

