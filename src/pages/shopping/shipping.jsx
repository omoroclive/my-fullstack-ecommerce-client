import React from 'react';
import G4SLogo from '../../assets/images/G4SLogo.jpg';
import DHLLogo from '../../assets/images/DHLLogo.jpg';
import FedExLogo from '../../assets/images/fedExLogo.jpg';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PublicIcon from '@mui/icons-material/Public';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedIcon from '@mui/icons-material/Verified';

function Shipping() {
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
        Shipping & Returns
      </Typography>

      <Grid container spacing={3}>
        {/* Local Shipping Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShippingIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Local Shipping
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enjoy fast and reliable delivery to your doorstep with our local shipping options. 
                Orders typically arrive within 2-4 business days.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                <VerifiedIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">Free shipping on orders over $50</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexWrap: 'wrap' }}>
                <Box 
                  component="img"
                  src={G4SLogo}
                  alt="G4S"
                  sx={{ 
                    height: 40, 
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'filter 0.3s, opacity 0.3s',
                    '&:hover': {
                      filter: 'grayscale(0%)',
                      opacity: 1
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* International Shipping Card */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${theme.palette.divider}`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Overseas Shipping
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                We ship worldwide! International orders typically arrive within 5-10 business days, 
                depending on your location and customs processing.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
                <VerifiedIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">Tracked shipping available</Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 3,
                gap: 2,
                flexWrap: isMobile ? 'wrap' : 'nowrap'
              }}>
                <Box 
                  component="img"
                  src={DHLLogo}
                  alt="DHL"
                  sx={{ 
                    height: 40, 
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'filter 0.3s, opacity 0.3s',
                    '&:hover': {
                      filter: 'grayscale(0%)',
                      opacity: 1
                    }
                  }}
                />
                <Box 
                  component="img"
                  src={FedExLogo}
                  alt="FedEx"
                  sx={{ 
                    height: 40, 
                    objectFit: 'contain',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'filter 0.3s, opacity 0.3s',
                    '&:hover': {
                      filter: 'grayscale(0%)',
                      opacity: 1
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Return Policy Card */}
        <Grid item xs={12}>
          <Card 
            elevation={0}
            sx={{ 
              mt: 2,
              border: `1px solid ${theme.palette.divider}`,
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: theme.shadows[2]
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  Our Return Policy
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                We want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, 
                you can return it within 30 days of delivery for a full refund or exchange.
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <VerifiedIcon fontSize="small" color="success" sx={{ mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Easy Returns</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start your return online and print a prepaid shipping label.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <VerifiedIcon fontSize="small" color="success" sx={{ mr: 1, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Quality Guarantee</Typography>
                      <Typography variant="body2" color="text.secondary">
                        All our products come with a quality guarantee.
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Shipping;
