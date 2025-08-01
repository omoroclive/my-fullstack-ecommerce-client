import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import CommonForm from "../../components/common/form";
import { loginFormControls } from "../../config/login";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/auth-slice";
import googleLogo from "../../assets/images/google.jpg";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = new URLSearchParams(location.search).get("redirectTo") || "/shop/home";

  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLoginSubmit = (formValues) => {
    dispatch(loginUser(formValues)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        const { token, user } = action.payload;
        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email); // Fix: `user.email`, not `response.data.user.email`
        
        // ✅ Always redirect to intended page if present
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
        }
      } else {
        console.error("Login failed:", action.error.message);
      }
    });
  };

  useEffect(() => {
    // Auto-redirect if already logged in
    if (isAuthenticated && user?.role) {
      navigate(user.role === "admin" ? "/admin/dashboard" : redirectTo);
    }
  }, [isAuthenticated, user, navigate, redirectTo]);

  const handleGoogleLogin = () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="w-full max-w-md px-6 py-8 bg-gradient-to-br from-gray-100 to-white shadow-lg rounded-lg mt-6 mx-auto">
      <h1 className="text-3xl font-bold text-center text-red-500 mb-4">
        Welcome Back
      </h1>
      <p className="text-sm text-center text-gray-600 mb-6">
        Login to your account to continue.
      </p>

      <CommonForm
        formControls={loginFormControls}
        onSubmit={handleLoginSubmit}
        submitButtonText={isLoading ? <CircularProgress size={24} /> : "Sign In"}
      />

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      <div className="text-right mt-2">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-blue-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or login with</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2"
        >
          <img src={googleLogo} alt="Google Logo" className="w-6 h-6" />
          <span>Login with Google</span>
        </Button>
      </div>

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
