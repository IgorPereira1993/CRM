import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const baseInputClass = 'w-full bg-[#0d1117] border border-[#1e2d4d] rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all';

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
    <input className={cn(baseInputClass, className)} {...props} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
    <textarea className={cn(baseInputClass, 'resize-none', className)} {...props} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

export const Select: React.FC<SelectProps> = ({ label, error, className, children, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
    <select className={cn(baseInputClass, 'cursor-pointer', className)} {...props}>
      {children}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
