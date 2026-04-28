import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import colors from '../../config/colors';

export const Navbar = () => {
  const navigate = useNavigate();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  return (
    <nav className="w-full h-[50px] bg-white flex items-center justify-between px-14 md:px-20 fixed top-0 left-0 z-50">
      <div className="flex items-center">
        <Link to="/" className="text-[30px] font-[900] tracking-wider uppercase" style={{ color: colors.secondary }}>
          LOGO
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative inline-block text-left mr-2">
          <div 
            className="flex items-center gap-1 cursor-pointer text-black text-[12px] font-bold select-none"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
          >
            ENG/FIN
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`mt-0.5 transition-transform ${showLangDropdown ? 'rotate-180' : ''}`}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 shadow-md rounded-md z-50 overflow-hidden">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-bold text-center">English</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[12px] font-bold text-center">Suomi</li>
              </ul>
            </div>
          )}
        </div>
        
        <Button variant="white" size="small" className="!w-auto" onClick={() => navigate('/login')}>
          Log In
        </Button>
        
        <Button variant="red" size="small" className="!w-auto" onClick={() => navigate('/signup')}>
          Sign Up
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
