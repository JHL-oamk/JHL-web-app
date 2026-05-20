/**
 * Sign Up Page - View Layer
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  useEffect(() => {
    if (authViewModel.isAuthenticated) {
      navigate('/settings');
    }
  }, [authViewModel.isAuthenticated]);

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
    }
  };

  return (
    <>
      <Navbar authViewModel={authViewModel} />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-2 pb-8">
        <Title text={t('signup.title')} />
        <Card>
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
              <p className="text-black text-[12px] font-medium">
                {t('signup.success')}
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
              <LoadingSpinner message={t('signup.submit')} />
            ) : (
              <>
                <TextInput
                  label={t('signup.email')}
                  name="email"
                  type="email"
                  value={signUpForm.formData.email}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.email}
                  touched={signUpForm.touched.email}
                  placeholder={t('signup.email_placeholder')}
                  required
                  disabled={authViewModel.isLoading}
                />

                <TextInput
                  label={t('signup.username')}
                  name="username"
                  type="text"
                  value={signUpForm.formData.username}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.username}
                  touched={signUpForm.touched.username}
                  placeholder={t('signup.username_placeholder')}
                  required
                  disabled={authViewModel.isLoading}
                />

                <TextInput
                  label={t('signup.password')}
                  name="password"
                  type="password"
                  value={signUpForm.formData.password}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.password}
                  touched={signUpForm.touched.password}
                  placeholder={t('signup.password_placeholder')}
                  required
                  disabled={authViewModel.isLoading}
                />

                <TextInput
                  label={t('signup.confirm_password')}
                  name="confirmPassword"
                  type="password"
                  value={signUpForm.formData.confirmPassword}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.confirmPassword}
                  touched={signUpForm.touched.confirmPassword}
                  placeholder={t('signup.confirm_password_placeholder')}
                  required
                  disabled={authViewModel.isLoading}
                />

                <TextInput
                  label={t('signup.organisation')}
                  name="organisation"
                  type="text"
                  value={signUpForm.formData.organisation}
                  onChange={signUpForm.handleInputChange}
                  onBlur={signUpForm.handleBlur}
                  error={signUpForm.errors.organisation}
                  touched={signUpForm.touched.organisation}
                  placeholder={t('signup.organisation_placeholder')}
                  disabled={authViewModel.isLoading}
                />

                <Button type="submit" className="mt-6" disabled={authViewModel.isLoading || showSuccess}>
                  {t('signup.submit')}
                </Button>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-[12px]" style={{ color: colors.darkGrey }}>
            <p>
              {t('signup.have_account')}{' '}
              <Link
                to="/login"
                className="font-bold hover:underline"
                style={{ color: colors.link }}
              >
                {t('signup.login_link')}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
