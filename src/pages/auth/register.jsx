import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonForm from "../../components/common/form";
import { registerFormControls } from "../../config/index";
import { useDispatch, useSelector } from "react-redux";
import { Button, CircularProgress } from "@mui/material";
import { registerUser } from "../../store/auth-slice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegisterSubmit = (formValues) => {
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
        // Move Sign Up button outside so we can position checkbox above it
        renderFooter={() => (
          <>
            {/* Terms and Conditions */}
            <div className="mt-4 text-sm text-gray-500">
              <label className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  className="mt-1 form-checkbox text-red-600"
                  required
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

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="error"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </div>
          </>
        )}
      />

      {/* Error Message */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-red-600 font-bold hover:underline">
            Login here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Register;
