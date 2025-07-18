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

/*  
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: String, // Optional field for product description
  size: String,
  color: String
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    shippingAddress: {
      phoneNumber: { type: String, required: true },
      fullName: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String },
      state: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Mpesa", "PayPal", "Cash on Delivery"],
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: [{
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    processedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model("Order", orderSchema);
*/

/*
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: String, // Optional field for product description
  size: String,
  color: String
});

const paymentDetailsSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Mpesa", "PayPal", "Cash on Delivery", "Credit Card", "Bank Transfer"],
    default: "Cash on Delivery"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded", "Partially Refunded"],
    default: "Pending"
  },
  paymentGateway: String, // For storing which gateway was used
  transactionId: String, // For storing gateway transaction ID
  amountPaid: Number, // Actual amount paid (might differ from order total)
  currency: {
    type: String,
    default: "KES" // Default currency for Mpesa
  },
  paymentMetadata: mongoose.Schema.Types.Mixed // For storing any gateway-specific data
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    shippingAddress: {
      phoneNumber: { type: String, required: true },
      fullName: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String },
      state: { type: String },
    },
    payment: paymentDetailsSchema, // Replaced simple paymentMethod with comprehensive payment details
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
    statusHistory: [{
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      note: String // Optional note about status change
    }],
    // Timestamps for important events
    processedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    returnRequestedAt: Date,
    notes: [{
      content: String,
      addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property to check if order is paid
orderSchema.virtual("isPaid").get(function() {
  return this.payment.paymentStatus === "Completed";
});

// Indexes for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "payment.paymentStatus": 1 });
orderSchema.index({ "payment.transactionId": 1 }, { unique: true, sparse: true });

// Pre-save hook to update status history
orderSchema.pre("save", function(next) {
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      changedBy: this.user // Assuming the user is changing their own order status
    });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
*/

/* 
const Order = require("../../config/model/orders");
const Inventory = require("../../config/model/Inventory");
const { sendOrderSMS } = require("../../helpers/smsService");
const mongoose = require('mongoose');

// Helper function to manage inventory changes
const updateInventory = async (orderItems, action, session = null) => {
  const ops = [];

  for (const item of orderItems) {
    const update = {
      $inc: {
        reservedItems: action === 'reserve' ? item.quantity :
          action === 'release' ? -item.quantity : 0,
        soldItems: action === 'confirm' ? item.quantity : 0,
        amountSold: action === 'confirm' ? (item.price * item.quantity) : 0
      }
    };

    ops.push(
      Inventory.findOneAndUpdate(
        { product: item.product },
        update,
        { session, new: true }
      ).exec()
    );
  }

  return Promise.all(ops);
};

// [NEW] Get all orders (admin) or user-specific orders
const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// [NEW] Get a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };

    const order = await Order.findOne(filter).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new order (with inventory reservation)
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, totalAmount, products } = req.body;

    // Validate input
    if (!shippingAddress || !paymentMethod || !totalAmount || !products?.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Missing required order details."
      });
    }

    // 1. Reserve inventory first
    await updateInventory(products, 'reserve', session);

    // 2. Create order
    const orderItems = products.map(item => ({
      product: item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      size: item.size,
      color: item.color,
      description: item.description 
    }));

    const newOrder = new Order({
      user: userId,
      products: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      statusHistory: [{
        status: "Pending",
        changedBy: userId
      }]
    });

    await newOrder.save({ session });
    await session.commitTransaction();

    // Send SMS notification to user
   // After order creation, add:
try {
  // SMS Notification
  const userPhone = req.user.phoneNumber || req.body.phoneNumber;
  if (userPhone) {
    const smsMessage = `Hi ${req.user.fullName || 'Customer'}, your order has been placed successfully. Total: KES ${totalAmount}. Thank you for shopping with us!`;
    await sendOrderSMS(userPhone, smsMessage);
  }
  
  // Email Notification
  const userEmail = req.user.email || req.body.email;
  if (userEmail) {
    const emailSubject = 'Your Order Confirmation';
    const emailText = `Hello ${req.user.fullName || 'Customer'},\n\nYour order #${newOrder._id} has been placed successfully.\n\nTotal Amount: KES ${totalAmount}\n\nThank you for your purchase!`;
    await sendOrderEmail(userEmail, emailSubject, emailText);
  }
} catch (notificationError) {
  console.error("Notification error:", notificationError);
  // Consider logging this to a monitoring service
}


    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message.includes('availableStock')
        ? "Insufficient stock for some items"
        : "Order creation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Confirm order payment (mark inventory as sold)
const confirmOrderPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 1. Confirm inventory deduction
    await updateInventory(order.products, 'confirm', session);

    // 2. Update order status
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = "Processing";
    order.statusHistory.push({
      status: "Processing",
      changedBy: req.user._id
    });

    await order.save({ session });
    await session.commitTransaction();

    // Send SMS notification to user
    try {
      const userPhone = req.user.phoneNumber || order.shippingAddress?.phoneNumber;
      if (userPhone) {
        const message = `Hi ${req.user.fullName || 'Customer'}, your payment was received successfully. Your order is now being processed.`;
        await sendOrderSMS(userPhone, message);
      }
    } catch (smsError) {
      console.warn("Failed to send payment confirmation SMS:", smsError.message);
    }


    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      order
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Payment confirmation error:", error);
    res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Cancel order (release inventory)
const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Only allow cancellation for pending/processing orders
    if (!["Pending", "Processing"].includes(order.orderStatus)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage"
      });
    }

    // 1. Release reserved inventory
    await updateInventory(order.products, 'release', session);

    // 2. Update order status
    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();
    order.statusHistory.push({
      status: "Cancelled",
      changedBy: req.user._id
    });

    await order.save({ session });
    await session.commitTransaction();

    // Send SMS notification to user
    try {
      const userPhone = req.user.phoneNumber || order.shippingAddress?.phoneNumber;
      if (userPhone && ["Shipped", "Delivered"].includes(orderStatus)) {
        const message =
          orderStatus === "Shipped"
            ? `Hi ${req.user.fullName || 'Customer'}, your order has been shipped.`
            : `Hi ${req.user.fullName || 'Customer'}, your order has been delivered. Enjoy your purchase!`;

        await sendOrderSMS(userPhone, message);
      }
    } catch (smsError) {
      console.warn("Failed to send order status SMS:", smsError.message);
    }


    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Order cancellation error:", error);
    res.status(500).json({
      success: false,
      message: "Order cancellation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ["Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(orderStatus)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update status and timestamps
    order.orderStatus = orderStatus;
    order.statusHistory.push({
      status: orderStatus,
      changedBy: req.user._id
    });

    if (orderStatus === "Shipped") order.shippedAt = new Date();
    if (orderStatus === "Delivered") order.deliveredAt = new Date();

    await order.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Status update error:", error);
    res.status(500).json({
      success: false,
      message: "Status update failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

// Get delivered orders
const getDeliveredOrders = async (req, res) => {
  try {
    const filter = {
      user: req.user._id,
      orderStatus: "Delivered"
    };
    const orders = await Order.find(filter)
      .sort({ deliveredAt: -1 })
      .lean();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Error fetching delivered orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivered orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User: Delete order (if still processing)
const deleteOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus !== "Pending") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Order cannot be deleted after it has been processed"
      });
    }

    // Release any reserved inventory
    await updateInventory(order.products, 'release', session);

    await Order.deleteOne({ _id: req.params.id }).session(session);
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getDeliveredOrders,
  confirmOrderPayment,
  cancelOrder
};
*/