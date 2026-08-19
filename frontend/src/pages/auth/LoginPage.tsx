import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, User, Lock, AlertCircle, Loader2, Mail, Phone, UserCheck, CheckCircle2 } from 'lucide-react';
import type { UserRole } from '../../types';
import { authService } from '../../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Toggle between Login (false) and Register/Create Account (true)
  const [isRegister, setIsRegister] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      const res = await authService.login({
        username: username.trim(),
        password: password,
        role: role
      });

      if (res.status === 'success') {
        setSuccessMsg('Login successful! Redirecting...');
        setTimeout(() => {
          if (role === 'officer') {
            navigate('/officer/dashboard');
          } else {
            navigate('/citizen/dashboard');
          }
        }, 600);
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your username/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      const res = await authService.register({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password,
        phone: phone.trim(),
        role: role
      });

      if (res.status === 'success') {
        setSuccessMsg('Account created successfully in Supabase! Redirecting to login page...');
        // Prefill login username/email field and switch to Login view after 1.2s
        setTimeout(() => {
          setIsRegister(false);
          setSuccessMsg('Account created! Please sign in with your new credentials.');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account. Please check input values.');
    } finally {
      setLoading(false);
    }
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
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                resetMessages();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                resetMessages();
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isRegister
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-5 p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-red-200 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Authentication Error</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">Success</p>
                <p className="mt-0.5 leading-relaxed">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {isRegister ? (
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <h3 className="text-sm font-semibold text-white mb-2">Create New Supabase Account</h3>
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      role === 'citizen'
                        ? 'bg-blue-700 border-blue-600 text-white font-semibold shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      role === 'officer'
                        ? 'bg-blue-700 border-blue-600 text-white font-semibold shadow-md'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Officer</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="reg-username" className="block text-xs font-medium text-slate-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Register Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account & Save to Supabase</span>
                )}
              </button>
            </form>
          ) : (
            /* Login Form */
            <form className="space-y-5" onSubmit={handleLoginSubmit}>
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

              {/* Username / Email */}
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
                    placeholder="Enter username or email"
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

              {/* Login Submit Button */}
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
          )}

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

