import React from 'react';
import mpesaLogo from '../../assets/images/mpesaLogo.jpg';
import paypalLogo from '../../assets/images/paypalLogo.jpg';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function Payment() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ my: 4, px: 2 }}>
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          mb: 3,
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 2
          }
        }}
      >
        Payment Options
      </Typography>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoOutlinedIcon sx={{ mr: 1, color: theme.palette.info.main }} />
          Choose your preferred payment method. All transactions are secure and encrypted.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* M-Pesa Payment Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  M-Pesa
                </Typography>
                <Box 
                  component="img"
                  src={mpesaLogo}
                  alt="M-Pesa"
                  sx={{ 
                    height: 40, 
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Pay instantly using M-Pesa mobile money service. Fast, secure, and convenient 
                for local transactions.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <SpeedIcon fontSize="small" color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Instant Processing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your payment is confirmed immediately
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <DevicesIcon fontSize="small" color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Mobile-Friendly
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pay directly from your phone with no additional apps
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ 
                  mt: 3,
                  borderRadius: 1.5,
                  height: 48
                }}
              >
                Pay with M-Pesa
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* PayPal Payment Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2 
              }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  PayPal
                </Typography>
                <Box 
                  component="img"
                  src={paypalLogo}
                  alt="PayPal"
                  sx={{ 
                    height: 40, 
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Pay securely with PayPal. Perfect for international transactions with 
                buyer protection and easy checkout.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                  <SecurityIcon fontSize="small" color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Buyer Protection
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your purchase is protected by PayPal's policy
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PaymentIcon fontSize="small" color="primary" sx={{ mr: 1.5, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Multiple Payment Methods
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Link your card or bank account to PayPal
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 3,
                  borderRadius: 1.5,
                  height: 48,
                  boxShadow: 'none'
                }}
              >
                Pay with PayPal
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Payment Security Information */}
      <Card 
        elevation={0}
        sx={{ 
          mt: 4,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Secure Payments
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            We use industry-standard encryption to protect your payment information. 
            Your data is never stored on our servers and all transactions are processed 
            securely through our trusted payment partners.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <SecurityIcon sx={{ mb: 1, color: theme.palette.success.main }} />
                <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
                  Encrypted Data
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <SpeedIcon sx={{ mb: 1, color: theme.palette.success.main }} />
                <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
                  Fast Processing
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <DevicesIcon sx={{ mb: 1, color: theme.palette.success.main }} />
                <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
                  Mobile Ready
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.02)'
              }}>
                <PaymentIcon sx={{ mb: 1, color: theme.palette.success.main }} />
                <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
                  Multiple Options
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Payment;
