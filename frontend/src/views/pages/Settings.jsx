import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';

export const Settings = ({ authViewModel }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await authViewModel.logout();
    navigate('/login');
  };

  const isGoogleAccount = Boolean(authViewModel.user?.googleAccount);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!isGoogleAccount && !deletePassword) {
      alert(t('settings.password_required') || 'Please enter your password');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await authViewModel.deleteUser(isGoogleAccount ? undefined : deletePassword);
      if (result.success) {
        navigate('/login');
      } else {
        alert(t('settings.delete_error') || 'Failed to delete account: ' + result.message);
        setShowDeleteModal(false);
        setDeletePassword('');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(t('settings.delete_error') || 'An error occurred while deleting the account');
      setShowDeleteModal(false);
      setDeletePassword('');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePassword('');
  };

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[960px] mx-auto px-8 py-10">
        <h1 className="text-[24px] font-bold text-black mb-6">{t('settings.title')}</h1>

        <div
          className="rounded-3xl px-16 pt-8 pb-10"
          style={{ backgroundColor: colors.lightGrey }}
        >
          <div className="text-[16px] font-medium border-b border-[#E0E0E0] pb-3 mb-4" style={{ color: colors.darkGrey }}>
            {t('settings.user_profile')}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>{t('settings.username')}</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.username || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>{t('settings.email')}</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.email || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>{t('settings.google_account')}</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.googleAccount || '-'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>{t('settings.password')}</span>
              <a
                href="/resetpassword"
                className="text-[12px] font-bold hover:underline"
                style={{ color: colors.link }}
              >
                {t('settings.reset_password')}
              </a>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>{t('settings.organisation')}</span>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-black">{authViewModel.user?.organisation || '-'}</span>
                {!authViewModel.user?.organisation && (
                  <button
                    type="button"
                    className="h-[22px] px-3 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
                  >
                    {t('settings.join_organisation')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleLogout}
              className="h-[32px] px-12 rounded-full text-[12px] font-bold text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {t('settings.logout')}
            </button>

            <button
              onClick={handleDeleteAccount}
              className="text-[12px] font-medium hover:underline"
              style={{ color: colors.primary }}
            >
              {t('settings.delete_account')}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">{t('settings.delete_account_title') || 'Delete account'}</h2>
            <p className="text-sm mb-4 p-3 rounded-lg border border-yellow-400 bg-yellow-50" style={{ color: '#92400e' }}>
              {isGoogleAccount
                ? (t('settings.delete_account_warning_google') || 'Are you sure you want to delete this Google account?')
                : (t('settings.delete_account_warning') || 'Are you sure you want to delete this account?')}
            </p>
            {!isGoogleAccount && (
              <input
                type="password"
                placeholder={t('settings.enter_password') || 'Password'}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm"
                disabled={isDeleting}
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
                disabled={isDeleting}
              >
                {t('settings.cancel') || 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded text-sm font-medium text-white"
                style={{ backgroundColor: colors.primary }}
                disabled={isDeleting}
              >
                {isDeleting ? (t('settings.deleting') || 'Deleting...') : (t('settings.delete') || 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
