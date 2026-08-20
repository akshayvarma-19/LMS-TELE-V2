import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  AlertOctagon,
  FolderKanban,
  User,
  Menu,
  X,
  LogOut,
  Shield,
} from 'lucide-react';
import { Header } from '../components/common/Header';

export const OfficerLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Land Records', path: '/officer/land-records', icon: FileText },
    { label: 'Add Land Record', path: '/officer/land-records/new', icon: PlusCircle },
    { label: 'Grievances', path: '/officer/grievances', icon: AlertOctagon },
    { label: 'Documents / OCR', path: '/officer/documents', icon: FolderKanban },
    { label: 'Profile & Settings', path: '/officer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <Header userRole="officer" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (#034E4E) */}
        <aside className="hidden md:flex flex-col w-60 bg-[#034E4E] border-r border-[#023838] text-white shrink-0">
          <div className="px-4 py-3 border-b border-[#023838] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-white/90" />
              <span>TRACIA Officer Navigation</span>
            </span>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/officer/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-[#023838] text-white border-l-4 border-white font-semibold'
                      : 'text-white/80 hover:bg-[#023838]/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#023838]">
            <NavLink
              to="/login"
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-[#023838] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </NavLink>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="md:hidden bg-[#034E4E] text-white px-4 py-2 flex items-center justify-between border-b border-[#023838]">
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">TRACIA Officer Portal</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded text-white hover:bg-[#023838]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#034E4E] text-white transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 border-b border-[#023838] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">TRACIA Officer Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1 text-white/70">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-[#023838] text-white border-l-4 border-white font-semibold'
                      : 'text-white/80 hover:bg-[#023838]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full bg-white text-[#111827]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
