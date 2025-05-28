import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TripSubmission from '../pages/TripSubmission';
import TripHistory from '../pages/TripHistory';
import Insurance from '../pages/Insurance';
import Claims from '../pages/Claims';
import Notifications from '../pages/Notifications';
import ProtectedRoute from './ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip" element={<TripSubmission />} />
          <Route path="/trip-history" element={<TripHistory />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
