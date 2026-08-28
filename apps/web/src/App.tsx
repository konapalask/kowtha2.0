import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import Login from '@/pages/login';
import Logout from '@/pages/logout';
import Dashboard from '@/pages/dashboard/index';
import Loans from '@/pages/loans/index';
import Verify from '@/pages/verify/index';
import LoanVerifyDetails from '@/pages/verify/[id]';
import AttendancePage from '@/pages/attendance/index';
import Users from '@/pages/users/index';
import Organization from '@/pages/settings/organization';
import EditRequests from '@/pages/edit-requests/index';
import EditRequestDetails from '@/pages/edit-requests/[...slug]';
import DeleteAccount from '@/pages/delete-account';
import DynamicFormTest from '@/pages/test-dynamic-form';

export default function App() {
  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/delete-account" element={<DeleteAccount />} />

      {/* Main App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/loans" element={<Loans />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/verify/:id" element={<LoanVerifyDetails />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings/organization" element={<Organization />} />
      <Route path="/edit-requests" element={<EditRequests />} />
      <Route path="/edit-requests/*" element={<EditRequestDetails />} />
      <Route path="/test-dynamic-form" element={<DynamicFormTest />} />

      {/* Default / Fallback Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
