import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import colors from '../../config/colors';

export const Navbar = ({ authViewModel }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const isAuthenticated = authViewModel?.isAuthenticated;

  const navLinks = [
    { label: 'Chatbot', path: '/chatbot' },
    { label: 'Law Sources', path: '/law-sources' },
    { label: 'Admin', path: '/admin' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="w-full h-[50px] bg-white flex items-center justify-between px-10 md:px-16 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-10 w-full">
        <Link to="/" className="text-[30px] font-black tracking-wider uppercase" style={{ color: colors.secondary }}>
          LOGO
        </Link>

        {isAuthenticated && (
          <div className="flex items-end gap-12 h-[50px] ml-[180px]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} className="relative flex items-center justify-center h-[50px] px-3">
                  <span className={`text-[12px] font-medium ${isActive ? 'text-black' : 'text-[#7D7D7D]'}`}>
                    {link.label}
                  </span>
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
                    style={{ backgroundColor: isActive ? colors.primary : 'transparent' }}
                  />
                </Link>
              );
            })}
          </div>
        )}

        <div className="ml-auto flex items-center gap-6">
          <div className="relative inline-block text-left">
            <div
              className="flex items-center gap-1 cursor-pointer text-black text-[12px] font-medium select-none"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              ENG/FIN
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mt-0.5 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 shadow-md rounded-md z-50 overflow-hidden">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-medium text-center">English</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-medium text-center">Suomi</li>
                </ul>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative inline-block text-left">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <span className="text-[11px] font-bold text-white">
                    {authViewModel.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-[12px] font-medium" style={{ color: colors.darkGrey }}>
                  {authViewModel.user?.username || 'User'}
                </span>
                {authViewModel.user?.organisation && (
                  <span className="text-[12px] font-medium" style={{ color: colors.darkGrey }}>
                    ({authViewModel.user.organisation})
                  </span>
                )}
              </div>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md z-50 overflow-hidden">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-medium"
                      onClick={() => navigate('/settings')}
                    >
                      User Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-medium text-red-600"
                      onClick={async () => {
                        await authViewModel.logout();
                        navigate('/login');
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="white" size="small" className="!w-auto" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="red" size="small" className="!w-auto" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
