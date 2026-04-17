/**
 * Login Page ViewModel Hook
 * Handles login form state, validation, and submission
 */

import { useState, useCallback } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useLoginViewModel = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = useCallback((email) => {
    if (!email) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateEmail, validatePassword]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    if (name === 'email') {
      const error = validateEmail(formData.email);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          email: error,
        }));
      }
    } else if (name === 'password') {
      const error = validatePassword(formData.password);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          password: error,
        }));
      }
    }
  }, [formData, validateEmail, validatePassword]);

  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    validateForm,
    handleInputChange,
    handleBlur,
    resetForm,
    setFormData,
  };
};
