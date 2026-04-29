import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import colors from '../../config/colors';

export const Settings = ({ authViewModel }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authViewModel.logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Implement account deletion logic
      console.log('Delete account functionality to be implemented');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />

      <div className="max-w-[960px] mx-auto px-8 py-10">
        <h1 className="text-[24px] font-bold text-black mb-6">Settings</h1>

        <div
          className="rounded-3xl px-16 pt-8 pb-10"
          style={{ backgroundColor: colors.lightGrey }}
        >
          <div className="text-[16px] font-medium border-b border-[#E0E0E0] pb-3 mb-4" style={{ color: colors.darkGrey }}>
            User Profile
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>User Name:</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.username || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>User Email:</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.email || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>Linked Google Account:</span>
              <span className="text-[12px] font-bold text-black">{authViewModel.user?.googleAccount || '-'}</span>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>Password:</span>
              <a
                href="/resetpassword"
                className="text-[12px] font-bold hover:underline"
                style={{ color: colors.link }}
              >
                Reset password via email
              </a>
            </div>

            <div className="flex items-center justify-start gap-4">
              <span className="text-[12px] w-[160px]" style={{ color: colors.darkGrey }}>Organisation:</span>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-black">{authViewModel.user?.organisation || '-'}</span>
                {!authViewModel.user?.organisation && (
                  <button
                    type="button"
                    className="h-[22px] px-3 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: colors.grey, color: colors.darkGrey }}
                  >
                    Join organisation
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
              Log Out
            </button>

            <button
              onClick={handleDeleteAccount}
              className="text-[12px] font-medium hover:underline"
              style={{ color: colors.primary}}
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
