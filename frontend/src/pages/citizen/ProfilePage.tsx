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
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">User Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Identity management and contact information registered with the land portal.
        </p>
      </div>

      <ErrorAlert
        title="Profile Synchronization Notice"
        message="User metadata and role permissions will be fetched directly from Supabase Auth & Users table."
      />

      {notice && (
        <div className="p-3 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E]">
          {notice}
        </div>
      )}

      {/* Profile Card */}
      <div className="tracia-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#034E4E] text-white flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#101828]">Account Identity</h2>
              <span className="text-[11px] bg-[#F4F8F7] text-[#034E4E] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#D9E2E1]">
                Portal User
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="tracia-btn-secondary inline-flex items-center space-x-1.5 text-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Full Name</label>
              <input
                type="text"
                disabled={!editing}
                placeholder="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md disabled:bg-[#F4F8F7] disabled:opacity-80 focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Email Address</label>
              <input
                type="email"
                disabled={!editing}
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md disabled:bg-[#F4F8F7] disabled:opacity-80 focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Phone Number</label>
              <input
                type="tel"
                disabled={!editing}
                placeholder="+91 Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md disabled:bg-[#F4F8F7] disabled:opacity-80 focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">User Role</label>
              <input
                type="text"
                disabled
                value="Verified Portal Member"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F8F7] border border-[#D9E2E1] rounded-md text-[#667085] font-semibold"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="tracia-btn-primary inline-flex items-center space-x-1.5 text-xs"
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
