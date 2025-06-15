// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../api/auth'; // Assuming you have this function

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Redirect to login page after logout
  };
  
  // Simple authentication check for showing/hiding logout
  const isAuthenticated = () => !!localStorage.getItem('token');
  
  // Helper function to check if link is active
  const isActive = (path) => location.pathname === path;
  
  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }
  
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease'
  };
  
  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: 'bold'
  };
  
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '10px 20px', 
      backgroundColor: '#333', 
      color: 'white', 
      position: 'fixed', 
      width: 'calc(100% - 40px)', 
      top: 0, 
      left: 0, 
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Link 
          to="/dashboard" 
          style={isActive('/dashboard') ? activeLinkStyle : linkStyle}
        >
          Dashboard
        </Link>
        <Link 
          to="/customers" 
          style={isActive('/customers') ? activeLinkStyle : linkStyle}
        >
          Customers
        </Link>
        <Link 
          to="/jobs" 
          style={isActive('/jobs') ? activeLinkStyle : linkStyle}
        >
          Jobs
        </Link>
        <Link 
          to="/pipelines" 
          style={isActive('/pipelines') ? activeLinkStyle : linkStyle}
        >
          Pipelines
        </Link>
        <Link 
          to="/users" 
          style={isActive('/users') ? activeLinkStyle : linkStyle}
        >
          Users
        </Link>
        <Link 
          to="/profile" 
          style={isActive('/profile') ? activeLinkStyle : linkStyle}
        >
          Profile
        </Link>
      </div>
      <div>
        {isAuthenticated() && (
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'none', 
              border: '1px solid white', 
              color: 'white', 
              padding: '8px 15px', 
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;