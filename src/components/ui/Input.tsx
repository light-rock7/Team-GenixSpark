import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  className = '',
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-[13px] font-semibold tracking-[-0.01em] text-slate-800">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`block w-full rounded-xl border bg-white py-3 text-sm text-slate-950 shadow-[0_1px_2px_rgba(15,23,42,.03)] outline-none transition-all placeholder:text-slate-400 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-50'
              : 'border-slate-200 hover:border-slate-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-50'
          } disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';