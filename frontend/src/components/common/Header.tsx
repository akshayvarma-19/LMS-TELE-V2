import React from 'react';
import { Building2, Bell, User, LogOut, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole?: 'citizen' | 'officer';
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole = 'citizen', onLogout }) => {
  const navigate = useNavigate();

  const handlePortalSwitch = () => {
    if (userRole === 'citizen') {
      navigate('/officer/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  return (
    <header className="bg-white text-[#111827] border-b border-[#D9E3E3] sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: TRACIA PS-09 Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#034E4E] flex items-center justify-center text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold tracking-tight text-[#034E4E]">TRACIA</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F8FAFA] text-[#034E4E] border border-[#D9E3E3]">
                PS-09
              </span>
              <span className="hidden md:inline text-[#526262]">•</span>
              <span className="hidden md:inline text-xs font-medium text-[#526262]">
                Digital Land Record & Grievance Redressal
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <Link
              to="/citizen/notifications"
              className="p-1.5 rounded text-[#526262] hover:text-[#034E4E] hover:bg-[#F8FAFA] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Link>

            {/* Role / Portal Switcher */}
            <button
              onClick={handlePortalSwitch}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#F8FAFA] hover:bg-[#034E4E] hover:text-white text-[#034E4E] text-xs font-medium border border-[#D9E3E3] transition-colors group"
            >
              <RefreshCw className="w-3 h-3 text-[#034E4E] group-hover:text-white transition-colors" />
              <span className="capitalize">{userRole === 'citizen' ? 'Officer Portal' : 'Citizen Portal'}</span>
            </button>

            {/* Profile */}
            <Link
              to={userRole === 'officer' ? '/officer/profile' : '/citizen/profile'}
              className="p-1.5 rounded text-[#526262] hover:text-[#034E4E] hover:bg-[#F8FAFA] transition-colors"
              title="Profile & Settings"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Logout */}
            <Link
              to="/login"
              onClick={onLogout}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded bg-white hover:bg-[#F8FAFA] text-[#526262] hover:text-[#034E4E] border border-[#D9E3E3] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
