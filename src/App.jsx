/**
 * Main App Component
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthViewModel } from './viewModels/useAuthViewModel';
import { Login } from './views/pages/Login';
import { SignUp } from './views/pages/SignUp';
import { Dashboard } from './views/pages/Dashboard';
import { ResetPassword } from './views/pages/ResetPassword';
import { Chatbot } from "./views/pages/Chatbot";

function App() {
  const authViewModel = useAuthViewModel();

  return (
    <Router>
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
          path="/dashboard"
          element={
            authViewModel.isAuthenticated ? (
              <Dashboard authViewModel={authViewModel} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
