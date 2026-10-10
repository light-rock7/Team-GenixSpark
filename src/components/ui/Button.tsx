import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'secondary-dark' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
}: ButtonStyleOptions = {}): string => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl border font-semibold tracking-[-0.01em] transition-all duration-200 focus:outline-none focus:ring-4 select-none';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-5.5 py-3.5 gap-2.5',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'border-[#6d4aff] bg-[#6d4aff] text-white shadow-[0_8px_24px_rgba(109,74,255,.18)] hover:-translate-y-px hover:bg-[#5f42eb] hover:shadow-[0_12px_30px_rgba(109,74,255,.24)] focus:ring-violet-100',
    secondary: 'border-slate-950 bg-slate-950 text-white shadow-sm hover:-translate-y-px hover:bg-slate-800 focus:ring-slate-200',
    'secondary-dark': 'border-white/10 bg-white/8 text-white backdrop-blur hover:bg-white/13 focus:ring-white/10',
    outline: 'border-slate-200 bg-white text-slate-800 shadow-sm hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-100',
    ghost: 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:ring-slate-100',
    danger: 'border-rose-600 bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus:ring-rose-100',
  };

  return [
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth ? 'w-full' : '',
    disabled ? 'cursor-not-allowed opacity-55 hover:translate-y-0' : '',
    className,
  ].filter(Boolean).join(' ');
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      className={getButtonClassName({ variant, size, fullWidth, className, disabled: isDisabled })}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};