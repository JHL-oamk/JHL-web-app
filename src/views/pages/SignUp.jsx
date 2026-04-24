/**
 * Sign Up Page - View Layer
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUpViewModel } from '../../viewModels/useSignUpViewModel';
import { FormInput } from '../components/FormInput';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const SignUp = ({ authViewModel }) => {
  const navigate = useNavigate();
  const signUpForm = useSignUpViewModel();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signUpForm.validateForm()) {
      return;
    }

    const result = await authViewModel.register(
      signUpForm.formData.email,
      signUpForm.formData.username,
      signUpForm.formData.password,
      signUpForm.formData.organisation
    );

    if (result.success) {
      setShowSuccess(true);
      signUpForm.resetForm();
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Create Account
            </h1>
            <p className="text-gray-700">
              Join us and get started today
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-none">
              <p className="text-black text-sm font-medium">
                ✓ Account created successfully! Redirecting...
              </p>
            </div>
          )}

          {/* Error Message */}
          {authViewModel.error && !showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-none">
              <p className="text-black text-sm font-medium">
                {authViewModel.error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {authViewModel.isLoading ? (
              <LoadingSpinner message="Creating account..." />
            ) : (
              <>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={signUpForm.formData.email}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.email}
                  touched={signUpForm.touched.email}
                  placeholder="you@example.com"
                  required
                  disabled={authViewModel.isLoading}
                />

                <FormInput
                  label="Username"
                  name="username"
                  type="text"
                  value={signUpForm.formData.username}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.username}
                  touched={signUpForm.touched.username}
                  placeholder="Choose a username"
                  required
                  disabled={authViewModel.isLoading}
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={signUpForm.formData.password}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.password}
                  touched={signUpForm.touched.password}
                  placeholder="At least 8 characters"
                  required
                  disabled={authViewModel.isLoading}
                />

                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={signUpForm.formData.confirmPassword}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.confirmPassword}
                  touched={signUpForm.touched.confirmPassword}
                  placeholder="Confirm your password"
                  required
                  disabled={authViewModel.isLoading}
                />

                <FormInput
                  label="Organisation"
                  name="organisation"
                  type="text"
                  value={signUpForm.formData.organisation}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.organisation}
                  touched={signUpForm.touched.organisation}
                  placeholder="Your organisation (optional)"
                  disabled={authViewModel.isLoading}
                  />

                <button
                  type="submit"
                  disabled={authViewModel.isLoading || showSuccess}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-none transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed mt-6"
                >
                  Create Account
                </button>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-black">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-black hover:text-gray-700 font-semibold underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Requirements Info */}
          <div className="mt-6 p-4 bg-white rounded-none border-2 border-black">
            <p className="text-xs text-black font-semibold mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-black space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Username: 3+ characters (letters, numbers, underscores)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
