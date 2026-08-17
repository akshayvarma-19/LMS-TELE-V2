import React from 'react';
import { Bell } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';

export const CitizenNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">
          System updates, land record modifications, and grievance status notifications.
        </p>
      </div>

      <ErrorAlert
        title="Notification Dispatch Status"
        message="Live alerts for grievance updates and OCR verification logs will sync automatically when connected to backend database services."
      />

      <EmptyState
        title="No new notifications"
        description="Updates regarding your land records or submitted grievances will arrive here."
        icon={<Bell className="w-6 h-6 text-slate-400" />}
      />
    </div>
  );
};
