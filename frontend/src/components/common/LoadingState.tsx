import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Connecting to service...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-white border border-[#E5E5E5] my-4">
      <Loader2 className="w-8 h-8 text-[rgb(3,78,78)] animate-spin mb-3" />
      <p className="text-sm font-medium text-[#1F1F1F]">{message}</p>
      <p className="text-xs text-[#1F1F1F]/60 mt-1">Awaiting backend response</p>
    </div>
  );
};
