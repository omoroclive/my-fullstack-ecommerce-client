import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const routes = {
    admin: "/admin/dashboard",
    shop: "/shop/home",
    unauthPage: "/unauth-page",
    login: "/auth/login",
  };

  // List of public paths accessible to everyone
  const publicPaths = ["/", "/home", "/product", "/details", "/category", "/brand"];

  const isPublicPath = publicPaths.some((path) => location.pathname.startsWith(path));

  // Allow access to public pages even if not authenticated
  if (!isAuthenticated && !location.pathname.startsWith("/auth") && !isPublicPath) {
    return <Navigate to={routes.login} replace />;
  }

  // Redirect authenticated users away from auth routes (e.g., login, register)
  if (isAuthenticated && location.pathname.startsWith("/auth")) {
    return <Navigate to={user?.role === "admin" ? routes.admin : routes.shop} replace />;
  }

  // Restrict admin routes to admin users only
  if (location.pathname.startsWith("/admin") && user?.role !== "admin") {
    return <Navigate to={routes.unauthPage} replace />;
  }

  // Redirect admins away from shop routes
  if (location.pathname.startsWith("/shop") && user?.role === "admin") {
    return <Navigate to={routes.admin} replace />;
  }

  return <>{children}</>;
};

export default CheckAuth;
