import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserSuccess } from "../../store/auth-slice";


function GoogleAuthHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (!token) {
      console.error("Google login failed: No token received");
      navigate("/auth/login");
      return;
    }

    // ✅ Save token
    localStorage.setItem("token", token);

    try {
      // ✅ Optionally decode token to get user info
      const decoded = jwt_decode(token);
      const user = {
        email: decoded.email,
        role: decoded.role,
        _id: decoded.userId,
      };

      dispatch(loginUserSuccess({ user, token }));
      navigate(user.role === "admin" ? "/admin/dashboard" : "/shop/home");
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      navigate("/auth/login");
    }
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl text-gray-700 font-medium animate-fade-in">
          Logging in to Smartshop
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes loadingDots {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .loading-dots .dot {
          opacity: 0;
          animation: loadingDots 1.4s infinite;
          display: inline-block;
        }

        .loading-dots .dot:nth-child(1) { animation-delay: 0s; }
        .loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}

export default GoogleAuthHandler;
