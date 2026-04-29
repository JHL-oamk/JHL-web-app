/**
 * Sign Up Page - View Layer
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUpViewModel } from '../../viewModels/useSignUpViewModel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Title } from '../components/Title';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';

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
      // Redirect to settings after 1.5 seconds
      setTimeout(() => {
        navigate('/settings');
      }, 1500);
    }
  };

  return (
    <>
      <Navbar authViewModel={authViewModel} />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-2 pb-8">
        <Title text="SIGN UP" />
        <Card>
          {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
            <p className="text-black text-[12px] font-medium">
              ✓ Account created successfully! Redirecting...
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
            <LoadingSpinner message="Creating account..." />
          ) : (
            <>
              <TextInput
                label="Email"
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

                <TextInput
                  label="User Name"
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

                <TextInput
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

                <TextInput
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

                <TextInput
                  label="Organisation (Optional)"
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

                <Button type="submit" className="mt-6" disabled={authViewModel.isLoading || showSuccess}>
                  Sign Up
                </Button>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-[12px]" style={{ color: colors.darkGrey }}>
            <p>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold hover:underline"
                style={{ color: colors.link }}
              >
                Log In!
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
