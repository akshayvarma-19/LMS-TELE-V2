import React, { useEffect, useState } from 'react';
import { Building2, Bell, User, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';

interface HeaderProps {
  userRole?: 'citizen' | 'officer';
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole = 'citizen', onLogout }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (userRole === 'citizen') {
      const loadUnread = async () => {
        try {
          const res = await notificationService.getNotifications();
          if ((res.success || res.status === 'success') && res.data) {
            const count = res.data.filter((n: any) => !n.is_read).length;
            setUnreadCount(count);
          }
        } catch (e) {
          // Suppress background errors
        }
      };

      loadUnread();

      const handleUpdate = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail && typeof detail.unreadCount === 'number') {
          setUnreadCount(detail.unreadCount);
        }
      };

      window.addEventListener('notifications-updated', handleUpdate);
      return () => {
        window.removeEventListener('notifications-updated', handleUpdate);
      };
    }
  }, [userRole]);

  const handlePortalSwitch = () => {
    if (userRole === 'citizen') {
      navigate('/officer/dashboard');
    } else {
      navigate('/citizen/dashboard');
    }
  };

  return (
    <header className="bg-white text-[#172121] border-b border-[#DDE5E3] sticky top-0 z-30 shadow-[0_1px_3px_rgba(23,33,33,0.04)]">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#034E4E] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="text-lg font-extrabold tracking-tight text-[#034E4E]">TRACIA</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#F4F8F7] text-[#034E4E] border border-[#DDE5E3] tracking-wide">
                PS-09
              </span>
              <span className="hidden md:inline text-[#667085]">•</span>
              <span className="hidden md:inline text-xs font-semibold text-[#667085] tracking-wide">
                Digital Land Record & Grievance Redressal
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell */}
            <Link
              to="/citizen/notifications"
              className="relative p-2 rounded-lg text-[#667085] hover:text-[#034E4E] hover:bg-[#F4F8F7] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {userRole === 'citizen' && unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#DC2626] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Portal Switcher Button */}
            <button
              onClick={handlePortalSwitch}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F4F8F7] hover:bg-[#034E4E] hover:text-white text-[#034E4E] text-xs font-bold border border-[#DDE5E3] transition-all group shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#034E4E] group-hover:text-white transition-colors" />
              <span className="hidden sm:inline">
                {userRole === 'citizen' ? 'Officer Portal' : 'Citizen Portal'}
              </span>
              <RefreshCw className="w-3 h-3 text-[#667085] group-hover:text-white sm:hidden transition-colors" />
            </button>

            {/* User Profile */}
            <Link
              to={userRole === 'officer' ? '/officer/profile' : '/citizen/profile'}
              className="p-2 rounded-lg text-[#667085] hover:text-[#034E4E] hover:bg-[#F4F8F7] transition-colors"
              title="Profile & Settings"
            >
              <User className="w-4.5 h-4.5" />
            </Link>

            {/* Logout Button */}
            <Link
              to="/login"
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-[#F4F8F7] text-[#667085] hover:text-[#034E4E] border border-[#DDE5E3] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
