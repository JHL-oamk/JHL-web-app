/**
 * Sign Up Page ViewModel Hook
 * Handles sign up form state, validation, and submission
 */

import { useState, useCallback } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const useSignUpViewModel = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    organisation: '',
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

  const validateUsername = useCallback((username) => {
    if (!username) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    return '';
  }, []);

  const validateConfirmPassword = useCallback(
    (confirmPassword) => {
      if (!confirmPassword) {
        return 'Please confirm your password';
      }
      if (confirmPassword !== formData.password) {
        return 'Passwords do not match';
      }
      return '';
    },
    [formData.password]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const usernameError = validateUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword);
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    formData,
    validateEmail,
    validateUsername,
    validatePassword,
    validateConfirmPassword,
  ]);

  const handleInputChange = useCallback(
    (e) => {
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
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      let error = '';
      if (name === 'email') {
        error = validateEmail(formData.email);
      } else if (name === 'username') {
        error = validateUsername(formData.username);
      } else if (name === 'password') {
        error = validatePassword(formData.password);
      } else if (name === 'confirmPassword') {
        error = validateConfirmPassword(formData.confirmPassword);
      }

      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [
      formData,
      validateEmail,
      validateUsername,
      validatePassword,
      validateConfirmPassword,
    ]
  );

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      organisation: '',
    });
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
