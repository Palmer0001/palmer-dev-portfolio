import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Layout Components
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import NewTicket from './pages/NewTicket';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/tickets" element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/new" element={
          <ProtectedRoute>
            <NewTicket />
          </ProtectedRoute>
        } />
        
        <Route path="/tickets/:id" element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;