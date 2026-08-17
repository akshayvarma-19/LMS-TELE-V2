import React from 'react';
import { ServerOff } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'Backend Connection Required',
  message = 'This feature requires active communication with the backend service. Data will populate automatically when integrated.',
}) => {
  return (
    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6 text-amber-900">
      <div className="flex items-start space-x-3">
        <ServerOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold flex items-center space-x-2">
            <span>{title}</span>
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};
