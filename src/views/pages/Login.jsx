/**
 * Login Page - View Layer
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginViewModel } from '../../viewModels/useLoginViewModel';
import { FormInput } from '../components/FormInput';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Login = ({ authViewModel }) => {
  const navigate = useNavigate();
  const loginForm = useLoginViewModel();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.validateForm()) {
      return;
    }

    const result = await authViewModel.login(
      loginForm.formData.email,
      loginForm.formData.password
    );

    if (result.success) {
      setShowSuccess(true);
      loginForm.resetForm();
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
              Welcome Back
            </h1>
            <p className="text-gray-700">
              Sign in to your account to continue
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-none">
              <p className="text-black text-sm font-medium">
                ✓ Login successful! Redirecting...
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
              <LoadingSpinner message="Logging in..." />
            ) : (
              <>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={loginForm.formData.email}
                  onChange={loginForm.handleInputChange}
                  onBlur={loginForm.handleBlur}
                  error={loginForm.errors.email}
                  touched={loginForm.touched.email}
                  placeholder="you@example.com"
                  required
                  disabled={authViewModel.isLoading}
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={loginForm.formData.password}
                  onChange={loginForm.handleInputChange}
                  onBlur={loginForm.handleBlur}
                  error={loginForm.errors.password}
                  touched={loginForm.touched.password}
                  placeholder="Enter your password"
                  required
                  disabled={authViewModel.isLoading}
                />

                <button
                  type="submit"
                  disabled={authViewModel.isLoading || showSuccess}
                  className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-none transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed mt-6"
                >
                  Sign In
                </button>
              </>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-black">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-black hover:text-gray-700 font-semibold underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
