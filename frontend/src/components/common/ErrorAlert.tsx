import React from 'react';
import { Info } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Data services are currently unavailable.',
  message = 'Your records will appear here when the service is connected.',
}) => {
  return (
    <div className="rounded-lg bg-slate-100 border border-[#D9E0E8] px-4 py-3 text-[#0F172A]">
      <div className="flex items-center space-x-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs">
          <span className="font-semibold text-slate-800">{title}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-600">{message}</span>
        </div>
      </div>
    </div>
  );
};
