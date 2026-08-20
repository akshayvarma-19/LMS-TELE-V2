import React from 'react';
import { Bell } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#034E4E] tracking-tight">Notifications</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          System updates, land record modifications, and grievance status notifications.
        </p>
      </div>

      <ErrorAlert
        title="Notification Dispatch Notice"
        message="Live alerts for grievance updates and OCR verification logs will sync automatically when connected to backend database services."
      />

      <EmptyState
        title="No new notifications"
        description="Updates regarding your land records or submitted grievances will arrive here."
        icon={<Bell className="w-6 h-6 text-[#034E4E]" />}
      />
    </div>
  );
};
