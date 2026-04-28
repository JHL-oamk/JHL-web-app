/**
 * Reset Password Page - View Layer
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Title } from '../components/Title';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';
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
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24 pb-8 px-4">
        <div className="w-full max-w-[400px]">
          <Title text="RESET PASSWORD" />
          <Card>
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
          <form onSubmit={handleSubmit} className="mt-8">
            <p className="text-[13px] leading-tight font-bold mb-6" style={{ color: '#000000' }}>
              *Reset Password via Email.We will send a link to the email you used when you signed up your account.Type in your email below to receive the link.
            </p>
            {vm.loading ? (
              <LoadingSpinner message="Sending reset link..." />
            ) : (
              <>
                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  value={vm.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={vm.errorMessage && touched.email ? vm.errorMessage : ''}
                  touched={touched.email}
                  placeholder=""
                  autoComplete="email"
                  required={false}
                  disabled={vm.loading || vm.cooldown > 0 || showSuccess}
                />

                {/* Log In text in middle */}
                <div className="text-center my-6">
                  <Link to="/login" className="text-[11px] font-bold hover:underline" style={{ color: colors.link }}>
                    Log In?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isDisabled}
                  className={`mt-4 ${vm.cooldown > 0 || vm.loading ? 'bg-gray-400 text-gray-700' : ''}`}
                >
                  {vm.cooldown > 0 ? `Wait ${vm.cooldown}s` : 'Send Reset Link'}
                </Button>

                {vm.cooldown > 0 && (
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    You can request another email in {vm.cooldown} seconds
                  </p>
                )}
              </>
            )}
          </form>

        </Card>
      </div>
    </div>
    </>
  );
};