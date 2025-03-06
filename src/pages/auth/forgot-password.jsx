import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { Email, ArrowForward, Error } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If successful
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to send reset link. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Check your email
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            We've sent a password reset link to your email address.
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setSuccess(false)}
            sx={{ mt: 2 }}
          >
            Back to reset password
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Forgot Password
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert 
              severity="error" 
              icon={<Error />}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            InputProps={{
              startAdornment: <Email color="action" sx={{ mr: 1 }} />
            }}
            sx={{ mb: 2 }}
          />

          <Button 
            type="submit" 
            variant="contained"
            fullWidth
            disabled={isLoading}
            endIcon={isLoading ? undefined : <ArrowForward />}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Sending reset link...
              </Box>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
