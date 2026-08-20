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
    <div className="rounded-xl bg-[#F4F8F7] border border-[#DDE5E3] px-4 py-3 text-[#172121] shadow-[0_1px_3px_rgba(23,33,33,0.03)]">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-5 rounded-full bg-[#034E4E] text-white flex items-center justify-center shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-xs">
          <span className="font-bold text-[#172121]">{title}</span>
          <span className="text-[#667085] hidden sm:inline">•</span>
          <span className="text-[#667085]">{message}</span>
        </div>
      </div>
    </div>
  );
};
