/**
 * Login Page - View Layer
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginViewModel } from '../../viewModels/useLoginViewModel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Title } from '../components/Title';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';

import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';

export const Login = ({ authViewModel }) => {
  const navigate = useNavigate();
  const loginForm = useLoginViewModel();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.validateForm()) return;

    const result = await authViewModel.login(
      loginForm.formData.email,
      loginForm.formData.password
    );

    if (result.success) {
      setShowSuccess(true);
      loginForm.resetForm();

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24 pb-8 p-4">
        <div className="w-full max-w-[400px]">
          <Title text="LOG IN" />
          <Card>
            {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black">
              <p className="text-black text-sm font-medium">
                ✓ Login successful! Redirecting...
              </p>
            </div>
          )}

          {/* Error Message */}
          {authViewModel.error && !showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black">
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
                <TextInput
                  label="Email"
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

                <TextInput
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

                {/* Forgot password link */}
                <div className="text-center mt-3 mb-6">
                  <Link
                    to="/resetpassword"
                    className="text-[11px] font-bold hover:underline"
                    style={{ color: colors.darkGrey }}
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-3.5 h-3.5 rounded-sm appearance-none flex items-center justify-center relative cursor-pointer checked:bg-highlight"
                    style={{ backgroundColor: colors.highlight }}
                  />
                  <label htmlFor="remember" className="text-[12px] font-bold cursor-pointer" style={{ color: colors.darkGrey }}>
                    Remember me
                  </label>
                </div>

                <Button type="submit" className="mt-6" disabled={authViewModel.isLoading || showSuccess}>
                  Log In
                </Button>
              </>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-[12px] font-bold text-darkGrey">
            <p>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="hover:underline"
                style={{ color: colors.link }}
              >
                Sign up!
              </Link>
            </p>
          </div>

          <div className="my-6 h-[1px] bg-gray-200"></div>

          <Button variant="red" className="mt-0">
            Log In With Google
          </Button>
        </Card>
      </div>
    </div>
    </>
  );
};