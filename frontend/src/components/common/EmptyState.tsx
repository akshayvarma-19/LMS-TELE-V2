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
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-white border border-[#D9E2E1] my-2 shadow-[0_2px_8px_rgba(16,24,40,0.02)]">
      <div className="w-11 h-11 rounded-full bg-[#EAF4F3] border border-[#0B6868]/20 flex items-center justify-center text-[#034E4E] mb-3 shrink-0">
        {icon || <Database className="w-5 h-5 text-[#034E4E]" />}
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-[#101828] mb-1">{title}</h3>
      <p className="text-xs text-[#667085] max-w-sm mb-3 leading-relaxed">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};
