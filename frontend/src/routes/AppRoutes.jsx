import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from '../pages/SplashScreen';
import Login from '../pages/Login';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';

const isAuthenticated = () => !!localStorage.getItem('token');

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
        <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;
