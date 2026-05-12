/**
 * Login Page - View Layer
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginViewModel } from '../../viewModels/useLoginViewModel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GoogleButton } from "../components/GoogleButton";
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
  const [rememberMe, setRememberMe] = useState(false);

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
        navigate('/chatbot');
      }, 1500);
    }
  };

//Google Sign in handler
const handleGoogleLogin = async () => {
  const result = await authViewModel.loginWithGoogle();

  if (result.success) {
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/chatbot");
    }, 1500);
  }
};

  return (
    <>
      <Navbar authViewModel={authViewModel} />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-0 pb-8">
        <Title text="LOG IN" />
        <Card>
          {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
            <p className="text-black text-[12px] font-medium">
              ✓ Login successful! Redirecting...
            </p>
          </div>
        )}

        {/* Error Message */}
        {authViewModel.error && !showSuccess && (
          <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
            <p className="text-black text-[12px] font-medium">
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
                    className="text-[12px] font-medium hover:underline"
                    style={{ color: colors.darkGrey }}
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-sm appearance-none flex items-center justify-center relative cursor-pointer border-2 transition-all"
                    style={{
                      borderColor: colors.highlight,
                      backgroundColor: rememberMe ? colors.highlight : 'transparent'
                    }}
                  />
                  <label htmlFor="remember" className="text-[12px] font-medium cursor-pointer" style={{ color: colors.darkGrey }}>
                    Remember me
                  </label>
                </div>

                <Button type="submit" className="mt-6" disabled={authViewModel.isLoading || showSuccess}>
                  Log In
                </Button>
              </>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
           <div className="flex-1 border-t border-gray-300"></div>
           <span className="px-3 text-sm text-gray-500">or</span>    
          <div className="flex-1 border-t border-gray-300"></div>
         </div>

        {/* Google Login */}
        <GoogleButton
          onClick={handleGoogleLogin}
          disabled={authViewModel.isLoading}
        />

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-[12px] font-medium" style={{ color: colors.darkGrey }}>
            <p>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-bold hover:underline"
                style={{ color: colors.link }}
              >
                Sign up!
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </>
  );
};