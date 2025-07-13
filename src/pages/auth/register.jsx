import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form";
import { registerFormControls } from "../../config/index";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { registerUser } from "../../store/auth-slice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("warning");

  const handleRegisterSubmit = (formValues) => {
    if (!agreedToTerms) {
      setSnackbarMessage(
        "Please agree to the Terms & Conditions and Privacy Policy to proceed."
      );
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    dispatch(registerUser(formValues)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigate("/auth/login");
      } else {
        setSnackbarMessage(error || "Registration failed. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Registration failed:", error || action.payload);
      }
    });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <div className="w-full max-w-md px-8 py-10 bg-white shadow-lg rounded-xl mt-8 mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create Your Account
      </h1>

      {/* Registration Form */}
      <CommonForm
        formControls={registerFormControls}
        onSubmit={handleRegisterSubmit}
        submitButtonText={isLoading ? <CircularProgress size={24} /> : "Sign Up"}
      />

      {/* Terms and Conditions */}
      <div className="mb-4 text-sm text-gray-500">
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            className="form-checkbox mt-1 text-red-600"
            required
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <a
              href="/auth/terms"
              className="text-red-600 font-medium hover:underline"
            >
              Smartshop Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/auth/privacy"
              className="text-red-600 font-medium hover:underline"
            >
              Privacy Policy
            </a>.
          </span>
        </label>
      </div>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-red-600 font-bold hover:underline"
          >
            Login here
          </Link>.
        </p>
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
