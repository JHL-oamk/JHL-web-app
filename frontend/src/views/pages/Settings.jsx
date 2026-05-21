import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';

export const Settings = ({ authViewModel }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await authViewModel.logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('settings.delete_confirm'))) {
      console.log('Delete account functionality to be implemented');
    }
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
    </div>
  );
};

export default Settings;
