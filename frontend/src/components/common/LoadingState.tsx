import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Connecting to service...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-white border border-[#D9E2E1] my-4">
      <Loader2 className="w-8 h-8 text-[#034E4E] animate-spin mb-3" />
      <p className="text-sm font-semibold text-[#101828]">{message}</p>
      <p className="text-xs text-[#667085] mt-1">Awaiting TRACIA backend response</p>
    </div>
  );
};
