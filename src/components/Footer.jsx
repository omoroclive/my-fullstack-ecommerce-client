import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  LocalShipping,
  Refresh,
  CreditCard,
  LocationOn,
  Phone,
  Email
} from "@mui/icons-material";
import { 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Box,
  Tooltip,
  Divider
} from "@mui/material";
import paypalLogo from "../assets/images/paypalLogo.jpg";
import mpesaLogo from "../assets/images/mpesaLogo.jpg";

function Footer() {
  const brands = [
    { name: "Adidas", path: "/shop/brands/adidas" },
    { name: "Nike", path: "/shop/brands/nike" },
    { name: "Puma", path: "/shop/brands/puma" },
    { name: "Zara", path: "/shop/brands/zara" },
  ];

  const features = [
    { icon: LocalShipping, text: "Free Shipping" },
    { icon: Refresh, text: "30 Days Return" },
    { icon: CreditCard, text: "Secure Payment" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", color: "#1877f2" },
    { icon: Twitter, href: "https://twitter.com", color: "#1da1f2" },
    { icon: Instagram, href: "https://instagram.com", color: "#e4405f" },
    { icon: LinkedIn, href: "https://linkedin.com", color: "#0077b5" },
  ];

  return (
    <Box sx={{ bgcolor: "grey.900", color: "common.white", mt: 12 }}>
      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 4, borderBottom: 1, borderColor: "grey.800" }}>
          <Grid container spacing={3} justifyContent="space-around">
            {features.map((feature, index) => (
              <Grid item key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <feature.icon sx={{ color: "primary.main" }} />
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                  {feature.text}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Main Footer Content */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Shop by Brand */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Shop by Brand
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {brands.map((brand, index) => (
                  <Link
                    key={index}
                    to={brand.path}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "grey.400",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        "&:hover": { color: "common.white" },
                        transition: "color 0.2s",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          bgcolor: "primary.main",
                          borderRadius: "50%",
                        }}
                      />
                      {brand.name}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    123 Fashion Street, NY 10001
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    +1 234 567 890
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    contact@example.com
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Payment Options */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Payment Methods
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Pay with PayPal">
                  <Box
                    sx={{
                      bgcolor: "common.white",
                      p: 1,
                      borderRadius: 1,
                      width: 64,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={paypalLogo}
                      alt="PayPal"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Pay with M-Pesa">
                  <Box
                    sx={{
                      bgcolor: "common.white",
                      p: 1,
                      borderRadius: 1,
                      width: 64,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={mpesaLogo}
                      alt="M-Pesa"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </Box>
                </Tooltip>
              </Box>
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                Connect With Us
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "grey.400",
                      "&:hover": { color: social.color },
                      transition: "color 0.2s",
                    }}
                  >
                    <social.icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Copyright */}
        <Divider sx={{ borderColor: "grey.800" }} />
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "grey.400" }}>
            © {new Date().getFullYear()} Clive Omoro. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;


