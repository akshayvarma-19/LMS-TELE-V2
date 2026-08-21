import React, { useState, useEffect } from 'react';
import { User as UserIcon, Edit2, Save, Loader2 } from 'lucide-react';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { authService } from '../../services/authService';

export const ProfilePage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState('citizen');
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await authService.getCurrentUser();
      if ((res.status === 'success' || res.success) && res.data) {
        setFullName((res.data as any).name || res.data.full_name || '');
        setEmail(res.data.email || '');
        setPhone(res.data.phone || '');
        setUserRole(res.data.role || 'citizen');
      } else {
        setErrorMsg(res.message || 'Failed to retrieve profile data.');
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setErrorMsg(err.message || 'Error connecting to auth service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setErrorMsg(null);
    setSaving(true);

    try {
      const res = await authService.updateProfile({
        full_name: fullName,
        phone
      });

      if (res.status === 'success' || res.success) {
        setNotice('Profile updated successfully!');
        setEditing(false);
        if (res.data) {
          setFullName((res.data as any).name || res.data.full_name || '');
          setPhone(res.data.phone || '');
        }
      } else {
        setErrorMsg(res.message || 'Failed to update profile changes.');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setErrorMsg(err.message || 'Error saving profile details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
        <span className="ml-2 text-sm text-slate-500 font-semibold">Loading profile information...</span>
      </div>
    );
  }

  const isOfficer = userRole === 'officer';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">User Profile & Settings</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Identity management and contact information registered with the land portal.
        </p>
      </div>

      {errorMsg && (
        <ErrorAlert
          title="Profile Error"
          message={errorMsg}
        />
      )}

      {notice && (
        <div className="p-3.5 rounded bg-[#F4F8F7] border border-[#D9E2E1] text-xs text-[#034E4E] font-semibold">
          {notice}
        </div>
      )}

      {/* Profile Card */}
      <div className="tracia-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9E2E1] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#034E4E] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#101828]">Account Identity</h2>
              <span className="text-[10px] bg-[#EAF4F3] text-[#034E4E] px-2.5 py-0.5 rounded-lg font-bold uppercase tracking-wider border border-[#0B6868]/20">
                {isOfficer ? 'Revenue Officer' : 'Portal Citizen'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setEditing(!editing);
              setNotice(null);
              setErrorMsg(null);
            }}
            type="button"
            className="tracia-btn-secondary inline-flex items-center space-x-1.5 text-xs cursor-pointer"
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
                disabled={!editing || saving}
                placeholder="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md disabled:bg-[#F4F8F7] disabled:opacity-80 focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Email Address</label>
              <input
                type="email"
                disabled
                placeholder="email@example.com"
                value={email}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F8F7] border border-[#D9E2E1] rounded-md text-[#667085]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Phone Number</label>
              <input
                type="tel"
                disabled={!editing || saving}
                placeholder="+91 Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-[#D9E2E1] rounded-md disabled:bg-[#F4F8F7] disabled:opacity-80 focus:border-[#034E4E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">User Role</label>
              <input
                type="text"
                disabled
                value={isOfficer ? 'Revenue Administration Officer' : 'Verified Portal Member / Landowner'}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F8F7] border border-[#D9E2E1] rounded-md text-[#667085] font-semibold"
              />
            </div>
          </div>

          {editing && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="tracia-btn-primary inline-flex items-center space-x-1.5 text-xs disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
