import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records available.',
  description = 'Your records will appear here when the service is connected.',
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-white border border-[#E5E5E5] my-3">
      <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[rgb(30,139,139)] mb-3">
        {icon || <Database className="w-5 h-5" />}
      </div>
      <h3 className="text-sm font-semibold text-[#1F1F1F] mb-1">{title}</h3>
      <p className="text-xs text-[#1F1F1F]/70 max-w-sm mb-3">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
