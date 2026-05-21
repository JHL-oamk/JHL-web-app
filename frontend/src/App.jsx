/**
 * Main App Component
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthViewModel } from './viewModels/useAuthViewModel';
import { Login } from './views/pages/Login';
import { SignUp } from './views/pages/SignUp';
import { Settings } from './views/pages/Settings';
import { ResetPassword } from './views/pages/ResetPassword';
import { Chatbot } from './views/pages/Chatbot';
import { LawSources } from './views/pages/LawSources';
import { Admin } from './views/pages/Admin';
import { LoadingSpinner } from './views/components/LoadingSpinner';
import { useInactivityLogout } from './hooks/useInactivityLogout.js';
import { Toaster } from 'react-hot-toast';
import './config/i18n';

function AppContent({ authViewModel }) {
useInactivityLogout(authViewModel.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login authViewModel={authViewModel} />}
      />
      <Route
        path="/signup"
        element={<SignUp authViewModel={authViewModel} />}
      />
      <Route
        path="/resetpassword"
        element={<ResetPassword authViewModel={authViewModel} />}
      />
      <Route
        path="/settings"
        element={
          authViewModel.isAuthenticated ? (
            <Settings authViewModel={authViewModel} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/law-sources"
        element={
          authViewModel.isAuthenticated ? (
            <LawSources authViewModel={authViewModel} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin"
        element={
          authViewModel.isAuthenticated ? (
            <Admin authViewModel={authViewModel} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/chatbot"
        element={
          authViewModel.isAuthenticated ? (
            <Chatbot authViewModel={authViewModel} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          authViewModel.isAuthenticated ? (
            <Navigate to="/settings" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  const authViewModel = useAuthViewModel();

  if (authViewModel.isSessionLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <AppContent authViewModel={authViewModel} />
    </Router>
  );
}

export default App;