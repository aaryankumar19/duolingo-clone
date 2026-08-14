import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-extrabold uppercase tracking-wider text-[#777777]">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full h-12 px-4 bg-[#f7f7f7] border-2 border-[#e5e5e5] focus:border-[#1cb0f6] focus:bg-white rounded-2xl font-bold text-[#4b4b4b] placeholder-[#afafaf] outline-none text-[15px] transition-colors',
          error && 'border-[#ff4b4b] focus:border-[#ff4b4b]',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs font-bold text-[#ff4b4b]">{error}</span>}
    </div>
  );
};
