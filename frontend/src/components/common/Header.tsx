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
    <header className="bg-[#0B1F3A] text-white border-b border-[#1E293B] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Official Government Header Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-[#1D4ED8] flex items-center justify-center text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">Government Portal</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                PS-09
              </span>
              <span className="hidden md:inline text-slate-500">•</span>
              <span className="hidden md:inline text-xs font-semibold text-slate-200">
                Digital Land Record & Grievance Redressal Portal
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <Link
              to="/citizen/notifications"
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </Link>

            {/* Role / Portal Switcher */}
            <button
              onClick={handlePortalSwitch}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-blue-400" />
              <span className="capitalize">{userRole === 'citizen' ? 'Officer Portal' : 'Citizen Portal'}</span>
            </button>

            {/* Profile */}
            <Link
              to={userRole === 'officer' ? '/officer/profile' : '/citizen/profile'}
              className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors"
              title="Profile & Settings"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Logout */}
            <Link
              to="/login"
              onClick={onLogout}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
