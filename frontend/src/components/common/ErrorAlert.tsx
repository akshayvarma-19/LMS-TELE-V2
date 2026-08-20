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
    <div className="rounded-lg bg-white border border-[#E5E5E5] px-4 py-3 text-[#1F1F1F]">
      <div className="flex items-center space-x-2.5">
        <Info className="w-4 h-4 text-[rgb(30,139,139)] shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs">
          <span className="font-semibold text-[#1F1F1F]">{title}</span>
          <span className="text-[#1E8B8B] hidden sm:inline">•</span>
          <span className="text-[#1F1F1F]">{message}</span>
        </div>
      </div>
    </div>
  );
};
