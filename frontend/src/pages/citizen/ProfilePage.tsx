import React, { useState } from 'react';
import { User, Edit2, Save } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Backend Service Required. Profile modifications will save to Supabase when connected.');
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Identity management and contact information registered with the land portal.
        </p>
      </div>

      <ErrorAlert
        title="Profile Synchronization Status"
        message="User metadata and role permissions will be fetched directly from Supabase Auth & Users table."
      />

      {notice && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          {notice}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Account Identity</h2>
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Portal User
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                placeholder="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled={!editing}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                disabled={!editing}
                placeholder="+91 Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">User Role</label>
              <input
                type="text"
                disabled
                value="Verified Portal Member"
                className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
