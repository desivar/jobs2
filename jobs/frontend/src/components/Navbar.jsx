// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct
import { LogOut } from 'lucide-react'; // Import LogOut icon for the button

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth(); // Get auth state and logout function from context

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  // Don't show navbar on login or register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Tailwind CSS classes for consistent styling
  const linkClasses = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 hover:text-white 
    ${location.pathname === path ? 'bg-gray-900' : 'text-gray-300'}`;

  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left section: Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className={linkClasses('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/customers" className={linkClasses('/customers')}>
            Customers
          </Link>
          <Link to="/jobs" className={linkClasses('/jobs')}>
            Jobs
          </Link>
          <Link to="/pipelines" className={linkClasses('/pipelines')}>
            Pipelines
          </Link>
          <Link to="/users" className={linkClasses('/users')}>
            Users
          </Link>
          <Link to="/profile" className={linkClasses('/profile')}>
            Profile
          </Link>
        </div>

        {/* Right section: Logout Button */}
        <div>
          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;