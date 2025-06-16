// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import PipelineBoard from './pages/PipelineBoard';
import PipelinesPage from './pages/PipelinesPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage'; // Make sure this is imported

// --- NEW: Import AuthProvider and useAuth ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- UPDATED: PrivateRoute component to use AuthContext ---
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth(); // Get state from AuthContext

  if (loadingAuth) {
    return <div>Loading application...</div>; // Show loading while checking auth status
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {/* --- NEW: Wrap your app with AuthProvider --- */}
      <AuthProvider>
        <Navbar /> {/* Global navigation bar */}
        <div style={{ paddingTop: '60px' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />

            {/* Protected Routes - Now correctly using PrivateRoute with AuthContext */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

            <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
            <Route path="/customers/:id" element={<PrivateRoute><CustomerDetailsPage /></PrivateRoute>} />
            <Route path="/customers/new" element={<PrivateRoute><CustomerDetailsPage /></PrivateRoute>} />

            <Route path="/jobs" element={<PrivateRoute><PipelineBoard /></PrivateRoute>} />
            <Route path="/jobs/new" element={<PrivateRoute><div>Job Creation Form (TODO)</div></PrivateRoute>} />
            <Route path="/jobs/:id" element={<PrivateRoute><div>Job Details Page (TODO)</div></PrivateRoute>} />

            <Route path="/pipelines" element={<PrivateRoute><PipelinesPage /></PrivateRoute>} />
            <Route path="/pipelines/new" element={<PrivateRoute><div>Create Pipeline (TODO)</div></PrivateRoute>} />
            <Route path="/pipelines/:id" element={<PrivateRoute><div>Edit Pipeline (TODO)</div></PrivateRoute>} />

            <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} /> {/* Add this route for profile */}

            {/* Catch-all for 404 */}
            <Route path="*" element={<h2>404: Page Not Found</h2>} />
          </Routes>
        </div>
      </AuthProvider> {/* --- END AuthProvider --- */}
    </Router>
  );
}

export default App;