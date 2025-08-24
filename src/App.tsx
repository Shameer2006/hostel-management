import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';

// Student pages
import { Dashboard } from './pages/student/Dashboard';
import { Profile } from './pages/student/Profile';
import { OutpassApply } from './pages/student/OutpassApply';
import { LeaveForm } from './pages/student/LeaveForm';
import { Complaints } from './pages/student/Complaints';
import { Attendance } from './pages/student/Attendance';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OutpassRequests } from './pages/admin/OutpassRequests';
import { LeaveFormsAdmin } from './pages/admin/LeaveFormsAdmin';
import { ComplaintsAdmin } from './pages/admin/ComplaintsAdmin';
import { AttendanceAdmin } from './pages/admin/AttendanceAdmin';
import { HostelSettings } from './pages/admin/HostelSettings';

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout title="Dashboard" showBack={false}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="student">
            <Layout title="Profile">
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/outpass" element={
          <ProtectedRoute requiredRole="student">
            <Layout title="Apply Outpass">
              <OutpassApply />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/leave-form" element={
          <ProtectedRoute requiredRole="student">
            <Layout title="Leave Form">
              <LeaveForm />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/complaints" element={
          <ProtectedRoute requiredRole="student">
            <Layout title="Complaints">
              <Complaints />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute requiredRole="student">
            <Layout title="Attendance">
              <Attendance />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Admin Dashboard" showBack={false}>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/outpass" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Outpass Requests">
              <OutpassRequests />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/leave-forms" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Leave Forms">
              <LeaveFormsAdmin />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/complaints" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Complaints">
              <ComplaintsAdmin />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/attendance" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Attendance">
              <AttendanceAdmin />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <Layout title="Hostel Settings">
              <HostelSettings />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;