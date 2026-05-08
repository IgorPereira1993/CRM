import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', className)}>
    {children}
  </span>
);
