import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Search,
  AlertOctagon,
  Upload,
  Map,
  Bot,
  Bell,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Header } from '../components/common/Header';

export const CitizenLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { label: 'My Land Records', path: '/citizen/land-records', icon: FileText },
    { label: 'Search Land Records', path: '/citizen/search', icon: Search },
    { label: 'My Grievances', path: '/citizen/grievances', icon: AlertOctagon },
    { label: 'Upload Document', path: '/citizen/ocr', icon: Upload },
    { label: '3D Land Map', path: '/citizen/map', icon: Map },
    { label: 'AI Assistant', path: '/citizen/assistant', icon: Bot },
    { label: 'Notifications', path: '/citizen/notifications', icon: Bell },
    { label: 'Profile & Settings', path: '/citizen/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Header userRole="citizen" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Deep Navy #0B1F3A) */}
        <aside className="hidden md:flex flex-col w-60 bg-[#0B1F3A] border-r border-[#1E293B] text-slate-300 shrink-0">
          <div className="px-4 py-3 border-b border-[#1E293B]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citizen Navigation</span>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/citizen/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2.5 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    isActive
                      ? 'bg-[#1E293B] text-white border-l-2 border-[#1D4ED8] font-semibold'
                      : 'text-slate-300 hover:bg-[#1E293B]/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#1E293B]">
            <NavLink
              to="/login"
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-[#1E293B] rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </NavLink>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="md:hidden bg-[#0B1F3A] text-white px-4 py-2 flex items-center justify-between border-b border-[#1E293B]">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Citizen Navigation</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded text-slate-300 hover:bg-[#1E293B]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0B1F3A] text-slate-300 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 border-b border-[#1E293B] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase">Navigation</span>
            <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
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
                      ? 'bg-[#1E293B] text-white border-l-2 border-[#1D4ED8] font-semibold'
                      : 'text-slate-300 hover:bg-[#1E293B]'
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
