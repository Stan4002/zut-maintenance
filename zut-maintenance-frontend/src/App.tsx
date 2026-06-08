import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SubmitReport } from './pages/SubmitReport';
import { MyReports } from './pages/MyReports';
import { AdminDashboard } from './pages/AdminDashboard';
function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>);

  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Navigate to={user?.role === 'admin' ? '/dashboard' : '/my-reports'} replace />);

}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route
        element={
        <ProtectedRoute allowedRoles={[ 'student' ]}>
            <Layout />
          </ProtectedRoute>
        }>
        
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/submit" element={<SubmitReport />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
        <ProtectedRoute allowedRoles={[ 'admin' ]}>
            <Layout />
          </ProtectedRoute>
        }>
        
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );

}