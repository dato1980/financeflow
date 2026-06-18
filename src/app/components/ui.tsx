import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'md' | 'lg' }
>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
  };
  return (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon }
>(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
      <input
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow',
          Icon && 'pl-9',
          className
        )}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export const Card = ({ className, children }: { className?: string, children: ReactNode }) => (
  <div className={cn('rounded-xl border border-gray-100 bg-white shadow-sm', className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string, children: ReactNode }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

export const CardTitle = ({ className, children }: { className?: string, children: ReactNode }) => (
  <h3 className={cn('font-semibold leading-none tracking-tight text-gray-900', className)}>
    {children}
  </h3>
);

export const CardContent = ({ className, children }: { className?: string, children: ReactNode }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);

export const Badge = ({ className, variant = 'default', children }: { className?: string, variant?: 'default' | 'success' | 'warning' | 'danger' | 'income' | 'expense' | 'outline', children: ReactNode }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    income: 'bg-emerald-100 text-emerald-800',
    expense: 'bg-rose-100 text-rose-800',
    outline: 'text-gray-800 border border-gray-200'
  };
  return (
    <div className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant], className)}>
      {children}
    </div>
  );
};
