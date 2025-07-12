
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form";
import { registerFormControls } from "../../config/index";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { registerUser } from "../../store/auth-slice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleRegisterSubmit = (formValues) => {
    if (!agreedToTerms) {
      alert("Please agree to the Terms & Conditions and Privacy Policy to proceed.");
      return;
    }
    dispatch(registerUser(formValues)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigate("/auth/login");
      } else {
        console.error("Registration failed:", error || action.payload);
      }
    });
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
        submitButtonText={
          isLoading ? <CircularProgress size={24} /> : "Sign Up"
        }
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
      {/* Error Message */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
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
    </div>
  );
}

export default Register;