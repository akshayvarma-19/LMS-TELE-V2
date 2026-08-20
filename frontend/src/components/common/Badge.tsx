import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, size = 'md' }) => {
  const styles: Record<BadgeVariant, string> = {
    primary: 'bg-[#EAF4F3] text-[#034E4E] border-[#0B6868]/30 font-semibold',
    success: 'bg-[#ECFDF5] text-[#047857] border-[#10B981]/30 font-semibold',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#F59E0B]/30 font-semibold',
    danger: 'bg-[#FEF2F2] text-[#B91C1C] border-[#EF4444]/30 font-semibold',
    info: 'bg-[#F0F9FF] text-[#0369A1] border-[#0284C7]/30 font-semibold',
    neutral: 'bg-[#F4F8F7] text-[#101828] border-[#D9E2E1] font-semibold',
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border ${styles[variant]} ${sizeStyles} tracking-wide`}>
      {children}
    </span>
  );
};
