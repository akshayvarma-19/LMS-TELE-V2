import React from 'react';
import { Shield, Building2, UserCircle, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  userRole?: 'citizen' | 'officer';
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, onLogout }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-semibold tracking-wider text-blue-400">Government Portal</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">PS-09</span>
              </div>
              <h1 className="text-sm font-bold text-slate-100 tracking-tight sm:text-base">
                Digital Land Record & Grievance Portal
              </h1>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium capitalize">{userRole || 'Guest'} Portal</span>
            </div>

            <Link
              to={userRole === 'officer' ? '/officer/profile' : '/citizen/profile'}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Profile & Settings"
            >
              <UserCircle className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
