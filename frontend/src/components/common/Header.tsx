import React from 'react';
import { Building2, Bell, UserCircle, LogOut, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole?: 'citizen' | 'officer';
  unreadNotificationsCount?: number;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole = 'citizen',
  unreadNotificationsCount = 0,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handlePortalSwitch = () => {
    if (userRole === 'citizen') {
      navigate('/officer/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Government Portal</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  PS-09
                </span>
              </div>
              <h1 className="text-xs font-bold text-white tracking-tight sm:text-sm">
                Digital Land Record & Grievance Portal
              </h1>
            </div>
          </div>

          {/* Right: Notification Bell, Portal Selector, User Avatar, Logout */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <Link
              to={userRole === 'officer' ? '/officer/documents' : '/citizen/notifications'}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-slate-900" />
              )}
            </Link>

            {/* Portal Switcher Button */}
            <button
              onClick={handlePortalSwitch}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Switch Portal View"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize">{userRole === 'citizen' ? 'Officer Portal' : 'Citizen Portal'}</span>
            </button>

            {/* User Profile */}
            <Link
              to={userRole === 'officer' ? '/officer/profile' : '/citizen/profile'}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Profile & Settings"
            >
              <UserCircle className="w-6 h-6" />
            </Link>

            {/* Logout */}
            <Link
              to="/login"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
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
