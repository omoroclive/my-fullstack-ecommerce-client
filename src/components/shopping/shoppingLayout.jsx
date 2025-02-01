import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./shoppingHeader";
import HeroSlider from "./heroSlider";

function ShoppingLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Common Navbar */}
      <Navbar />

      {/* Conditional Hero Section */}
      {location.pathname === "/shop/home" && (
        <div className="mb-8">
          <HeroSlider />
        </div>
      )}

      <main className="flex-grow p-6 sm:p-8 md:p-12 bg-white">
        {/* Nested Routes */}
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;


