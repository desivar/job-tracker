// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Create this component
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import PipelineBoard from './pages/PipelineBoard';
import PipelinesPage from './pages/PipelinesPage'; // For managing pipeline definitions
import UsersPage from './pages/UsersPage'; // For user management
import UserProfilePage from './pages/UserProfilePage'; // For individual user profile

// A simple mock for authentication status
// In a real app, this would come from AuthContext/Redux
const isAuthenticated = () => !!localStorage.getItem('token'); // Check for token

// A PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar /> {/* Global navigation bar */}
      <div style={{ paddingTop: '60px' }}> {/* Adjust for fixed navbar height */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect root to dashboard */}

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          
          <Route path="/customers" element={<PrivateRoute><CustomersPage /></PrivateRoute>} />
          <Route path="/customers/:id" element={<PrivateRoute><CustomerDetailsPage /></PrivateRoute>} />
          <Route path="/customers/new" element={<PrivateRoute><CustomerDetailsPage /></PrivateRoute>} /> {/* For creating new customer */}

          <Route path="/jobs" element={<PrivateRoute><PipelineBoard /></PrivateRoute>} /> {/* Pipeline board is main jobs view */}
          <Route path="/jobs/new" element={<PrivateRoute><div>Job Creation Form (TODO)</div></PrivateRoute>} /> {/* Separate job creation form */}
          <Route path="/jobs/:id" element={<PrivateRoute><div>Job Details Page (TODO)</div></PrivateRoute>} />

          <Route path="/pipelines" element={<PrivateRoute><PipelinesPage /></PrivateRoute>} />
          <Route path="/pipelines/new" element={<PrivateRoute><div>Create Pipeline (TODO)</div></PrivateRoute>} />
          <Route path="/pipelines/:id" element={<PrivateRoute><div>Edit Pipeline (TODO)</div></PrivateRoute>} />

          <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} /> {/* For admin to edit user */}
          <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} /> {/* For user's own profile */}

          {/* Catch-all for 404 */}
          <Route path="*" element={<h2>404: Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;