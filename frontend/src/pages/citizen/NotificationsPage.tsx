import React, { useEffect, useState } from 'react';
import { Bell, FileText, MessageSquare, Scan, Check, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'land_record' | 'grievance' | 'ocr' | 'system'>('all');

  const fetchNotifications = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await notificationService.getNotifications();
      if ((res.success || res.status === 'success') && res.data) {
        setNotifications(res.data);
        const unreadCount = res.data.filter(n => !n.is_read).length;
        window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount } }));
      } else {
        setErrorMsg(res.message || 'Failed to load notifications.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to notification service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success || res.status === 'success') {
        setNotifications(prev => {
          const updated = prev.map(n => (n.id === id ? { ...n, is_read: true } : n));
          const unreadCount = updated.filter(n => !n.is_read).length;
          window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount } }));
          return updated;
        });
      } else {
        alert(res.message || 'Failed to update notification.');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    try {
      await Promise.all(unreadIds.map(id => notificationService.markAsRead(id)));
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, is_read: true }));
        window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { unreadCount: 0 } }));
        return updated;
      });
    } catch (err: any) {
      alert(err.message || 'Failed to mark all as read.');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.is_read;
    return n.type === activeTab;
  });

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'land_record':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
        );
      case 'grievance':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
        );
      case 'ocr':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Scan className="w-4 h-4 text-amber-600" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-slate-500" />
          </div>
        );
    }
  };

  const getBadgeText = (type: Notification['type']) => {
    switch (type) {
      case 'land_record':
        return 'Land Record';
      case 'grievance':
        return 'Grievance Update';
      case 'ocr':
        return 'OCR Alert';
      case 'system':
      default:
        return 'System Notification';
    }
  };

  const getBadgeClass = (type: Notification['type']) => {
    switch (type) {
      case 'land_record':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'grievance':
        return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'ocr':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'system':
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'land_record', label: 'Land Records' },
    { id: 'grievance', label: 'Grievances' },
    { id: 'ocr', label: 'OCR Mismatches' },
    { id: 'system', label: 'System Updates' }
  ] as const;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header section with counts and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight flex items-center gap-2">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Real-time updates regarding your land registry, OCR deeds verification, and grievance petition progress.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="tracia-btn-secondary inline-flex items-center space-x-1 text-xs py-1.5 px-3 self-end sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {errorMsg && <ErrorAlert title="Connection Issue" message={errorMsg} />}

      {/* Tabs Filter Row */}
      <div className="flex overflow-x-auto pb-2 border-b border-[#D9E2E1] gap-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          let count = 0;
          if (tab.id === 'all') count = notifications.length;
          else if (tab.id === 'unread') count = unreadCount;
          else count = notifications.filter(n => n.type === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#034E4E] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#034E4E] hover:bg-slate-100'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#034E4E]" />
          <p className="text-xs text-[#667085] font-semibold">Synchronizing notifications feed...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title={activeTab === 'unread' ? 'All caught up!' : 'No notifications found'}
          description={
            activeTab === 'unread'
              ? 'You have read all received land records, OCR documents, and grievance updates.'
              : `There are currently no updates in the ${activeTab.replace('_', ' ')} feed.`
          }
          icon={
            activeTab === 'unread' ? (
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : (
              <Bell className="w-6 h-6 text-[#034E4E]" />
            )
          }
        />
      ) : (
        /* Notifications List */
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`tracia-card p-4 transition-all duration-300 flex gap-4 items-start ${
                !notification.is_read
                  ? 'border-l-4 border-l-[#034E4E] bg-[#F4F8F7]/50 shadow-sm'
                  : 'opacity-85 hover:opacity-100'
              }`}
            >
              {/* Icon */}
              {getIcon(notification.type)}

              {/* Message Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${getBadgeClass(notification.type)}`}>
                    {getBadgeText(notification.type)}
                  </span>
                  {!notification.is_read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#034E4E]" title="Unread notification" />
                  )}
                  <span className="text-[10px] text-[#667085] ml-auto font-medium">
                    {new Date(notification.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>

                <h3 className={`text-xs sm:text-sm font-bold text-slate-900 ${!notification.is_read ? 'font-extrabold text-[#034E4E]' : ''}`}>
                  {notification.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {notification.message}
                </p>
              </div>

              {/* Action Button */}
              {!notification.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  title="Mark as read"
                  className="p-1 rounded-full text-[#667085] hover:text-[#034E4E] hover:bg-slate-100 border border-[#D9E2E1] transition-all shrink-0 self-center"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
