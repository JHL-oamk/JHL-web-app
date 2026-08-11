import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { resetPasswordApi } from '../models/authApi';

export function useResetPasswordViewModel() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const intervalRef = useRef(null);

  const COOLDOWN_KEY = 'resetPasswordCooldownEnd';

  /**
   * Restore cooldown on refresh
   */
  useEffect(() => {
    const savedEndTime = localStorage.getItem(COOLDOWN_KEY);

    if (savedEndTime) {
      const remaining = Math.floor((Number(savedEndTime) - Date.now()) / 1000);

      if (remaining > 0) {
        startCooldown(remaining);
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsGoogleUser(user?.providerData?.some((provider) => provider.providerId === 'google.com') || false);
    });

    return () => {
      unsubscribe();
      clearInterval(intervalRef.current);
    };
  }, []);

  const onEmailChange = (value) => {
    setEmail(value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  /**
   * Validate email format
   */
  const validate = () => {
    if (!email) {
      setErrorMessage('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email');
      return false;
    }

    return true;
  };

  /**
   * Cooldown logic
   */
  const startCooldown = (seconds = 60) => {
    setCooldown(seconds);

    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem(COOLDOWN_KEY, endTime.toString());

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          localStorage.removeItem(COOLDOWN_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * MAIN FUNCTION
   * 1. send reset email
   * 2. start cooldown only on success
   */
  const resetPassword = async () => {
    if (loading || cooldown > 0) return false;
    if (!validate()) return false;

    if (isGoogleUser) {
      setErrorMessage('Google sign-in users cannot use password reset.');
      return false;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Firebase reset password (no email check needed)
      const response = await resetPasswordApi(email);

      if (response?.success) {
        setSuccessMessage(
          response.message ||
          'If this email exists, a reset link has been sent'
        );

        startCooldown(60);

        return true;
      } else {
        setErrorMessage(response?.message || 'Failed to send reset email');
        return false;
      }
    } catch (error) {
      setErrorMessage(error?.message || 'Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * UI helper
   */
  const canSubmit = email.length > 0 && !loading && cooldown === 0;

  return {
    email,
    loading,
    successMessage,
    errorMessage,
    cooldown,
    canSubmit,
    isGoogleUser,

    onEmailChange,
    resetPassword,
  };
}