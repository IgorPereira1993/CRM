import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    primary:   'bg-blue-600 hover:bg-blue-500 text-white border-blue-500/50 shadow-lg shadow-blue-500/20',
    secondary: 'bg-[#1e2432] hover:bg-[#252d3d] text-gray-200 border-[#2d3748]',
    ghost:     'bg-transparent hover:bg-white/5 text-gray-400 hover:text-gray-200 border-transparent',
    danger:    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30',
    success:   'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-500/30',
  };
  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
