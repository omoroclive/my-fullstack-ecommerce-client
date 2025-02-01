import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import logo from '../../assets/images/logo5.jpg';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
      {/* Container for the form */}
      <div className="w-full max-w-md px-6 py-8 bg-white shadow-md rounded-lg mt-10">
        
        {/* Logo and App name */}
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className="flex items-center">
            {/* Logo image */}
            <img 
              src={logo}
              alt="Oasis Logo" 
              className="w-16 h-auto object-contain" 
            />
            {/* App Name */}
            
          </Link>
        </div>
        
        {/* Outlet for Login/Register forms */}
        <Outlet />
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white text-center py-4 mt-6">
        <p>&copy; {new Date().getFullYear()} smartShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
