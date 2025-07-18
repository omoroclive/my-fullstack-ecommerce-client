import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import mpesaLogo from "../../assets/images/mpesaLogo.jpg";
import paypalLogo from "../../assets/images/paypalLogo.jpg";
import Footer from "../../components/Footer";
import Payment from "./payment";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.totalAmount);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const response = await axios.get(`${API_BASE_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Update shipping cost based on the selected address
  useEffect(() => {
    if (selectedAddress) {
      const address = addresses.find((addr) => addr._id === selectedAddress);
      if (address?.country.toLowerCase() === "kenya") {
        setShippingCost(5);
      } else {
        setShippingCost(10);
      }
    }
  }, [selectedAddress, addresses]);

  /* Commenting out payment processing for now - will be re-enabled when going live
  const handlePayment = async () => {
    if (!selectedAddress) {
      setSnackbar({
        open: true,
        message: "Please select an address.",
        severity: "error",
      });
      return;
    }

    if (paymentGateway === "mpesa" && !phoneNumber.match(/^2547\d{8}$/)) {
      setSnackbar({
        open: true,
        message: "Please enter a valid Kenyan phone number (e.g., 254712345678).",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const totalAmount =
        paymentGateway === "mpesa"
          ? (cartTotal + shippingCost) * 140
          : cartTotal + shippingCost;

      if (paymentGateway === "mpesa") {
        await axios.post(
          `${API_BASE_URL}/api/mpesa/stkpush`,
          { phone: phoneNumber, amount: totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (paymentGateway === "paypal") {
        await axios.post(
          `${API_BASE_URL}/api/paypal/create-order`,
          { amount: totalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSnackbar({
        open: true,
        message: "Payment successful! You can now place your order.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message || error.message || "Failed to process payment.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  */

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setSnackbar({
        open: true,
        message: "Please select an address before placing your order.",
        severity: "error",
      });
      return;
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      setSnackbar({
        open: true,
        message: "Your cart is empty. Please add items before placing an order.",
        severity: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      // Find the selected address
      const address = addresses.find((addr) => addr._id === selectedAddress);
      if (!address) {
        setSnackbar({
          open: true,
          message: "Selected address not found. Please select a valid address.",
          severity: "error",
        });
        return;
      }

      // Validate cart items have required fields
      const validatedProducts = cartItems.map((item) => {
        const productId = item._id || item.id || item.product;
        const productName = item.title || item.name;
        
        if (!productId || !productName || !item.quantity || !item.price || !item.image) {
          throw new Error(`Missing required product data for: ${productName || 'Unknown product'}`);
        }

        return {
          product: productId,
          name: productName,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size || '', // Optional fields
          color: item.color || '', // Optional fields
          description: item.description || '', // Optional fields
        };
      });

      // Prepare order details with all required fields
      const orderDetails = {
        shippingAddress: {
          fullName: address.fullName,
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state || '',
          zipCode: address.zipCode || '',
          country: address.country,
          phoneNumber: address.phoneNumber || phoneNumber,
        },
        products: validatedProducts,
        totalAmount: cartTotal + shippingCost,
        // Commenting out payment method for now
        // paymentMethod: paymentGateway === "mpesa" ? "Mpesa" : "PayPal",
        paymentMethod: "Cash on Delivery", // Temporary solution
      };

      console.log("Order details being sent:", orderDetails);

      // Send order details to the server
      const response = await axios.post(`${API_BASE_URL}/api/orders`, orderDetails, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Order response:", response.data);

      setSnackbar({
        open: true,
        message: "Order placed successfully! Redirecting to orders page...",
        severity: "success",
      });

      // Redirect to the orders page
      setTimeout(() => {
        navigate("/account/orders");
      }, 2000);

    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to place the order. Please try again.";
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "0 auto", padding: 4 }}>
      <Typography
        variant="h4"
        textAlign="center"
        marginBottom={4}
        backgroundColor="#F3F4F6"
        width="100vw"
        position="relative"
        left="calc(-50vw + 50%)"
      >
        Checkout
      </Typography>

      {/* Address Selection */}
      <Typography variant="h6" marginBottom={2}>
        Select Address
      </Typography>
      {addresses.length > 0 ? (
        <Select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          fullWidth
          displayEmpty
        >
          <MenuItem value="" disabled>
            Choose an address
          </MenuItem>
          {addresses.map((address) => (
            <MenuItem key={address._id} value={address._id}>
              {address.streetAddress}, {address.city}, {address.country}, {address.phoneNumber}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Box>
          <Typography color="error" marginBottom={2}>
            No address found. Please add one.
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/account/address")}
          >
            Add Address
          </Button>
        </Box>
      )}

      {/* Commenting out payment gateway selection for now
      <Typography variant="h6" marginTop={4} textAlign="center" marginBottom={2}>
        Payment Method
      </Typography>
      <RadioGroup
        value={paymentGateway}
        onChange={(e) => setPaymentGateway(e.target.value)}
        row
      >
        <FormControlLabel
          value="mpesa"
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center">
              <img src={mpesaLogo} alt="Mpesa" style={{ width: 50 }} />
              M-Pesa
            </Box>
          }
        />
        <FormControlLabel
          value="paypal"
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center">
              <img src={paypalLogo} alt="PayPal" style={{ width: 50 }} />
              PayPal
            </Box>
          }
        />
      </RadioGroup>

      {paymentGateway === "mpesa" && (
        <TextField
          label="Phone Number"
          placeholder="254791150726"
          fullWidth
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          margin="normal"
          required
        />
      )}
      */}

      {/* Receipt */}
      <Box marginTop={4} padding={2} border="1px solid #ddd" borderRadius={2}>
        <Typography variant="h6" marginBottom={2} textAlign="center">
          Receipt
        </Typography>
        <Typography>Cart Total: ${cartTotal.toFixed(2)}</Typography>
        <Typography>Shipping: ${shippingCost.toFixed(2)}</Typography>
        <Typography variant="h6" marginTop={2}>
          Total: $ {(cartTotal + shippingCost).toFixed(2)}
        </Typography>
      </Box>

      {/* Commenting out payment button for now
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={isSubmitting}
        sx={{
          backgroundColor: "darkblue",
          "&:hover": { backgroundColor: "blue" },
          marginTop: 3,
        }}
        onClick={handlePayment}
      >
        {isSubmitting ? "Processing..." : "Pay Now"}
      </Button>
      */}

      {/* Place Order Button */}
      <Button
        variant="contained" // Changed from outlined to contained for primary action
        color="primary"
        fullWidth
        disabled={isSubmitting}
        sx={{
          backgroundColor: "darkblue",
          "&:hover": { backgroundColor: "blue" },
          marginTop: 3,
        }}
        onClick={handlePlaceOrder}
      >
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </Button>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* <Payment /> */}
    </Box>
  );
};

export default Checkout;