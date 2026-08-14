import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'locked' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'font-extrabold uppercase tracking-wider rounded-2xl transition-all select-none flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0';

  const variantStyles = {
    primary:
      'bg-[#58cc02] hover:bg-[#61e002] text-white shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-[4px]',
    secondary:
      'bg-[#1cb0f6] hover:bg-[#24b9ff] text-white shadow-[0_4px_0_0_#1899d6] active:shadow-none active:translate-y-[4px]',
    outline:
      'bg-white hover:bg-gray-50 border-2 border-[#e5e5e5] text-[#1cb0f6] shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px]',
    danger:
      'bg-[#ff4b4b] hover:bg-[#ff5959] text-white shadow-[0_4px_0_0_#ea2b2b] active:shadow-none active:translate-y-[4px]',
    locked:
      'bg-[#e5e5e5] text-[#afafaf] shadow-[0_4px_0_0_#cecece] cursor-not-allowed active:shadow-[0_4px_0_0_#cecece] active:translate-y-0',
    ghost:
      'bg-transparent hover:bg-gray-100 text-[#4b4b4b] shadow-none active:bg-gray-200',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-xs h-9',
    md: 'py-3.5 px-6 text-sm h-12',
    lg: 'py-4 px-8 text-base h-14',
    xl: 'py-4 px-10 text-lg h-16',
  };

  return (
    <button
      disabled={disabled || variant === 'locked'}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
