import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import CommonForm from "../../components/common/form";
import { loginFormControls } from "../../config/login";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import googleLogo from "../../assets/images/google.jpg";
import facebookLogo from "../../assets/images/facebookIcon.jpg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLoginSubmit = (formValues) => {
    dispatch(loginUser(formValues)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        const { role, token } = action.payload.user;
        localStorage.setItem("accessToken", token);
        navigate(role === "admin" ? "/admin/dashboard" : "/shop/home");
      } else {
        console.error("Login failed:", action.error.message);
      }
    });
  };

  // Handle token passed via URL (e.g., from Google OAuth)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/shop/home");
    }
  }, [navigate]);

  // If already authenticated, redirect accordingly
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
    }
  }, [isAuthenticated, user, navigate]);

  const handleGoogleLogin = () => {
    const baseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://ecommerce-server-c6w5.onrender.com";
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="w-full max-w-md px-6 py-8 bg-gradient-to-br from-gray-100 to-white shadow-lg rounded-lg mt-6 mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-red-500 mb-4">
        Welcome Back
      </h1>
      <p className="text-sm text-center text-gray-600 mb-6">
        Login to your account to continue.
      </p>

      {/* Login Form */}
      <CommonForm
        formControls={loginFormControls}
        onSubmit={handleLoginSubmit}
        submitButtonText={isLoading ? <CircularProgress size={24} /> : "Sign In"}
      />

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Forgot Password Link */}
      <div className="text-right mt-2">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or login with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-4">
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          startIcon={
            <img src={googleLogo} alt="Google Logo" className="w-6 h-6" />
          }
        >
          Login with Google
        </Button>

        <Button
          variant="outlined"
          fullWidth
          startIcon={
            <img src={facebookLogo} alt="Facebook Logo" className="w-6 h-6" />
          }
          disabled
        >
          Login with Facebook
        </Button>
      </div>

      {/* Register Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-red-500 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
