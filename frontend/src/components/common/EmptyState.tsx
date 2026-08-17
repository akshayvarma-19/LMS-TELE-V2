import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records available',
  description = 'Your information will appear here once the backend service is connected.',
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-white border border-slate-200 shadow-sm my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        {icon || <Database className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-4">{description}</p>
      <div className="inline-flex items-center space-x-1 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 mb-4">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>Backend Connection Required</span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
