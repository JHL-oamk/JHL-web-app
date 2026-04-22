/**
 * Reset Password Page - View Layer
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useResetPasswordViewModel } from '../../viewModels/useResetPasswordViewModel';

export const ResetPassword = () => {
  const vm = useResetPasswordViewModel();

  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    vm.onEmailChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched((prev) => ({
      ...prev,
      email: true,
    }));
  };

  // ❌ NO redirect anymore
  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await vm.resetPassword();

    if (success) {
      setShowSuccess(true);
    }
  };

  const isDisabled = vm.loading || !vm.canSubmit;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Reset Password
            </h1>
            <p className="text-gray-700">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black">
              <p className="text-black text-sm font-medium">
                ✓ We’ve sent a password reset link if the email exists.
              </p>
            </div>
          )}

          {/* Error Message */}
          {vm.errorMessage && !showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black">
              <p className="text-black text-sm font-medium">
                {vm.errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {vm.loading ? (
              <LoadingSpinner message="Sending reset link..." />
            ) : (
              <>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={vm.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={
                    vm.errorMessage && touched.email
                      ? vm.errorMessage
                      : ''
                  }
                  touched={touched.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={vm.loading || vm.cooldown > 0 || showSuccess}
                />

                {/* Button */}
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full font-semibold py-2 px-4 mt-6 transition-colors disabled:cursor-not-allowed ${
                    vm.cooldown > 0 || vm.loading
                      ? 'bg-gray-400 text-gray-700'
                      : 'bg-black hover:bg-gray-900 text-white'
                  }`}
                >
                  {vm.cooldown > 0
                    ? `Wait ${vm.cooldown}s`
                    : 'Send Reset Link'}
                </button>

                {/* Countdown */}
                {vm.cooldown > 0 && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    You can request another email in {vm.cooldown} seconds
                  </p>
                )}
              </>
            )}
          </form>

          {/* Back to login (manual only) */}
          <div className="mt-6 text-center">
            <p className="text-black">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-black font-semibold underline hover:text-gray-700"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};