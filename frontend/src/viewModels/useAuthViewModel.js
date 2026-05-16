/**
 * Main Auth ViewModel Hook
 * Provides shared authentication state and methods
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { loginApi, registerApi, logoutApi, loginWithGoogleApi } from '../models/authApi';

export const useAuthViewModel = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isActiveLogin = useRef(false);

  // restores session on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { 
      if (!isActiveLogin.current) {
        if (currentUser) {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          const firestoreData = snap.exists() ? snap.data() : {};

          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            username: firestoreData.username || currentUser.displayName || 'User',
            organisation: firestoreData.organisation || null,
            googleAccount: currentUser.providerData?.find(p => p.providerId === 'google.com')?.email || null,
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setIsSessionLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    isActiveLogin.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(email, password);

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      isActiveLogin.current = false;
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, username, password, organisation) => {
    isActiveLogin.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi(email, username, password, organisation);

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'An error occurred during registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      isActiveLogin.current = false;
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await logoutApi();

      if (response.success) {
        setUser(null);
        setIsAuthenticated(false);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'An error occurred during logout';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  //Google sign in
  const loginWithGoogle = useCallback(async () => {
    isActiveLogin.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginWithGoogleApi();

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = "Google login failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      isActiveLogin.current = false;
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isSessionLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
    loginWithGoogle,
  };
};