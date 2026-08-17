import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Search,
  FileCheck,
  AlertOctagon,
  ShieldAlert,
  Map,
  Bot,
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
    { label: 'OCR Verification', path: '/citizen/ocr', icon: FileCheck },
    { label: 'My Grievances', path: '/citizen/grievances', icon: AlertOctagon },
    { label: 'Anomaly Alerts', path: '/citizen/anomalies', icon: ShieldAlert },
    { label: '3D Land Map', path: '/citizen/map', icon: Map },
    { label: 'AI Assistant', path: '/citizen/assistant', icon: Bot },
    { label: 'Profile & Settings', path: '/citizen/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header userRole="citizen" />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Citizen Navigation</h2>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/citizen/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-800">
            <NavLink
              to="/login"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </NavLink>
          </div>
        </aside>

        {/* Mobile Header / Drawer Button */}
        <div className="md:hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between border-b border-slate-800">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Citizen Portal</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
