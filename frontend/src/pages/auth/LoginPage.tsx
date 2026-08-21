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

  const handleBypassToDemo = async (selectedRole: UserRole) => {
    try {
      if (selectedRole === 'officer') {
        await authService.login({ username: 'deshana', password: 'password', role: 'officer' });
        navigate('/officer/dashboard');
      } else {
        await authService.login({ username: 'rama', password: 'password', role: 'citizen' });
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      if (selectedRole === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8FAFA] px-4 py-12 sm:px-6 lg:px-8 text-[#101828]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-[#034E4E] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#034E4E]">TRACIA</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-[#034E4E] border border-[#D9E2E1]">
              PS-09
            </span>
          </div>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-[#667085] tracking-wide">
          Digital Land Record & Grievance Redressal Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="tracia-card py-8 px-6 sm:px-10">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#F4F8F7] p-1 rounded-md border border-[#D9E2E1] mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                resetMessages();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded transition-all ${
                !isRegister
                  ? 'bg-[#034E4E] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#101828]'
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
              className={`flex-1 py-2 text-xs font-bold rounded transition-all ${
                isRegister
                  ? 'bg-[#034E4E] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#101828]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded bg-[#FEF2F2] border border-[#EF4444]/30 text-[#B91C1C] text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Error</p>
                <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded bg-[#ECFDF5] border border-[#10B981]/30 text-[#047857] text-xs flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Success</p>
                <p className="mt-0.5 leading-relaxed">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {isRegister ? (
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <h3 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-2">Create New Portal Account</h3>
              
              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-md border text-xs font-bold transition-all ${
                      role === 'citizen'
                        ? 'bg-[#034E4E] border-[#034E4E] text-white'
                        : 'bg-white border-[#D9E2E1] text-[#101828] hover:border-[#034E4E]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-md border text-xs font-bold transition-all ${
                      role === 'officer'
                        ? 'bg-[#034E4E] border-[#034E4E] text-white'
                        : 'bg-white border-[#D9E2E1] text-[#101828] hover:border-[#034E4E]'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Officer</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold text-[#101828] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="reg-username" className="block text-xs font-bold text-[#101828] mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose username"
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-[#101828] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className="block text-xs font-bold text-[#101828] mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-[#101828] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Register Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 tracia-btn-primary flex justify-center items-center text-xs disabled:opacity-50"
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
                <label className="block text-[11px] font-bold text-[#101828] uppercase tracking-wider mb-2">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('citizen')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-md border text-xs font-bold transition-all ${
                      role === 'citizen'
                        ? 'bg-[#034E4E] border-[#034E4E] text-white'
                        : 'bg-white border-[#D9E2E1] text-[#101828] hover:border-[#034E4E]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('officer')}
                    className={`flex items-center justify-center space-x-2 p-2.5 rounded-md border text-xs font-bold transition-all ${
                      role === 'officer'
                        ? 'bg-[#034E4E] border-[#034E4E] text-white'
                        : 'bg-white border-[#D9E2E1] text-[#101828] hover:border-[#034E4E]'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Officer</span>
                  </button>
                </div>
              </div>

              {/* Username / Email */}
              <div>
                <label htmlFor="username" className="block text-xs font-bold text-[#101828] mb-1">
                  Username / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
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
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-bold text-[#101828]">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset requires backend email service connection.');
                    }}
                    className="text-xs font-semibold text-[#034E4E] hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
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
                    className="block w-full pl-10 pr-3 py-2 bg-white border border-[#D9E2E1] rounded-md text-[#101828] focus:border-[#034E4E] focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Login Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full tracia-btn-primary flex justify-center items-center text-xs disabled:opacity-50"
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
          <div className="mt-6 border-t border-[#D9E2E1] pt-4 text-center">
            <p className="text-xs text-[#667085] mb-2 font-medium">Explore UI Layouts (Frontend Preview Mode):</p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => handleBypassToDemo('citizen')}
                className="tracia-btn-secondary text-xs"
              >
                Citizen Portal
              </button>
              <button
                type="button"
                onClick={() => handleBypassToDemo('officer')}
                className="tracia-btn-secondary text-xs"
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
