/**
 * Reset Password Page - View Layer
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/Card';
import { Title } from '../components/Title';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';
import { useResetPasswordViewModel } from '../../viewModels/useResetPasswordViewModel';

export const ResetPassword = ({ authViewModel }) => {
  const vm = useResetPasswordViewModel();
  const { t } = useTranslation();

  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    vm.onEmailChange(e.target.value);
  };

  const handleBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await vm.resetPassword();
    if (success) setShowSuccess(true);
  };

  const isDisabled = vm.loading || !vm.canSubmit;

  return (
    <>
      <Navbar authViewModel={authViewModel} />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-0 pb-8">
        <Title text={t('reset_password.title')} />
        <Card>
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
              <p className="text-black text-[12px] font-medium">
                {t('reset_password.success')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {vm.errorMessage && !showSuccess && (
            <div className="mb-6 p-4 bg-white border-2 border-black rounded-2xl">
              <p className="text-black text-[12px] font-medium">
                {vm.errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <p className="text-[12px] leading-relaxed font-medium mb-6" style={{ color: colors.darkGrey }}>
              {t('reset_password.description')}
            </p>
            {vm.loading ? (
              <LoadingSpinner message={t('reset_password.submit')} />
            ) : (
              <>
                <TextInput
                  label={t('reset_password.email')}
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

                <div className="text-center my-6">
                  <Link to="/login" className="text-[12px] font-bold hover:underline" style={{ color: colors.link }}>
                    {t('reset_password.login_link')}
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isDisabled}
                  className={`mt-4 ${vm.cooldown > 0 || vm.loading ? 'bg-gray-400 text-gray-700' : ''}`}
                >
                  {vm.cooldown > 0 ? t('reset_password.wait', { seconds: vm.cooldown }) : t('reset_password.submit')}
                </Button>

                {vm.cooldown > 0 && (
                  <p className="text-xs text-gray-600 mt-3 text-center">
                    {t('reset_password.cooldown', { seconds: vm.cooldown })}
                  </p>
                )}
              </>
            )}
          </form>
        </Card>
      </div>
    </>
  );
};
