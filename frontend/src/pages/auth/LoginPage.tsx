import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import type { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    // Simulate network attempt then show clear backend connection requirement state
    setTimeout(() => {
      setLoading(false);
      setNotice('Backend Connection Required. User authentication will be validated against the Supabase database once the backend service is active.');
    }, 800);
  };

  const handleBypassToDemo = (selectedRole: UserRole) => {
    if (selectedRole === 'officer') {
      navigate('/officer/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white shadow-xl">
            <Building2 className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Digital Land Record & Grievance Portal
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Government of Tamil Nadu • PS-09 Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-6 shadow-2xl rounded-2xl border border-slate-700 sm:px-10">
          {notice && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/70 border border-amber-700/80 text-amber-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Backend Disconnected</p>
                <p className="mt-0.5 leading-relaxed">{notice}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Select Portal Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('citizen')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    role === 'citizen'
                      ? 'bg-blue-700 border-blue-600 text-white font-semibold shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Citizen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('officer')}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    role === 'officer'
                      ? 'bg-blue-700 border-blue-600 text-white font-semibold shadow-md'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Officer</span>
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-300 mb-1">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset requires backend email service connection.');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Direct Navigation for UI Review */}
          <div className="mt-6 border-t border-slate-700/80 pt-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Explore UI Layouts (Frontend Preview Mode):</p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => handleBypassToDemo('citizen')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 text-xs font-medium rounded-lg text-slate-200 transition-colors"
              >
                Citizen Portal
              </button>
              <button
                type="button"
                onClick={() => handleBypassToDemo('officer')}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-650 text-xs font-medium rounded-lg text-slate-200 transition-colors"
              >
                Officer Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
