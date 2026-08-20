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
  ShieldCheck,
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFA] text-[#101828]">
      {/* Global Header */}
      <Header userRole="officer" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (#034E4E) */}
        <aside className="hidden md:flex flex-col w-64 bg-[#034E4E] border-r border-[#023B3B] text-white shrink-0 justify-between">
          <div>
            <div className="px-5 py-4 border-b border-[#023B3B]">
              <span className="text-[10px] font-extrabold uppercase text-white/70 tracking-widest flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-white/90" />
                <span>OFFICER NAVIGATION</span>
              </span>
            </div>

            <nav className="px-3 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/officer/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-[#034E4E] shadow-xs'
                        : 'text-white/85 hover:bg-[#023B3B] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#034E4E]' : 'text-white/80'}`} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Officer Emblem Box */}
          <div className="p-4 border-t border-[#023B3B]">
            <div className="p-3 bg-[#023B3B]/60 rounded-lg border border-white/10 flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-white shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-white tracking-tight">Revenue Administration</p>
                <p className="text-[10px] text-white/70">Verified Officer Portal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Nav Top Bar */}
        <div className="md:hidden bg-[#034E4E] text-white px-4 py-2.5 flex items-center justify-between border-b border-[#023B3B]">
          <span className="text-xs font-bold text-white/90 uppercase tracking-wider">Officer Portal</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded text-white hover:bg-[#023B3B]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#034E4E] text-white transform transition-transform duration-200 ease-in-out md:hidden flex flex-col justify-between ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="p-4 border-b border-[#023B3B] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Officer Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-white/80">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-white text-[#034E4E]'
                        : 'text-white/85 hover:bg-[#023B3B]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content & Footer */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-[#F8FAFA]">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          {/* Official Footer */}
          <footer className="border-t border-[#D9E2E1] bg-white px-6 py-4 text-center sm:text-left text-[11px] text-[#667085]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>© 2025 TRACIA. Revenue Administration Portal.</span>
              <span className="hidden sm:inline">•</span>
              <span>Building trust through transparency in land governance.</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold text-[#034E4E]">Version 1.0.0</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
