import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Connecting to service...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white border border-slate-200 shadow-sm my-4">
      <Loader2 className="w-8 h-8 text-blue-700 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Awaiting backend response</p>
    </div>
  );
};
