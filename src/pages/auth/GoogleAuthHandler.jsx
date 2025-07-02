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
      navigate("/login");
      return;
    }

    console.log("Received Token:", token);
    localStorage.setItem("token", token); // ✅ consistent with app-wide usage

    const backendURL = import.meta.env.PROD
      ? "https://ecommerce-server-c6w5.onrender.com"
      : "http://localhost:3000";

    fetch(`${backendURL}/auth/google/success`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
      mode: "cors", // ✅ ensure proper CORS behavior
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response not OK");
        return res.json();
      })
      .then((data) => {
        console.log("Google User Data from Backend:", data);

        if (data.user) {
          dispatch(loginUserSuccess({ user: data.user, token }));
          console.log("User successfully saved in Redux:", data.user);
          navigate("/shop/home");
        } else {
          console.error("User data missing from backend");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Google login error:", err);
        navigate("/login");
      });
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
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loadingDots {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .loading-dots .dot {
          opacity: 0;
          animation: loadingDots 1.4s infinite;
          display: inline-block;
        }

        .loading-dots .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .loading-dots .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}

export default GoogleAuthHandler;
