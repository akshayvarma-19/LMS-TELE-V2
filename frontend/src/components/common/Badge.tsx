import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, size = 'md' }) => {
  const styles: Record<BadgeVariant, string> = {
    success: 'bg-white text-[rgb(3,78,78)] border-[#71B2B2]',
    warning: 'bg-white text-[rgb(17,110,110)] border-[#71B2B2]',
    danger: 'bg-white text-[rgb(3,78,78)] border-[rgb(17,110,110)] font-bold',
    info: 'bg-white text-[rgb(30,139,139)] border-[#E5E5E5]',
    neutral: 'bg-white text-[#1F1F1F] border-[#E5E5E5]',
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center rounded-full border ${styles[variant]} ${sizeStyles}`}>
      {children}
    </span>
  );
};
