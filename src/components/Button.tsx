import React from 'react';
import { cn } from '../utils/cn';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'ghost' | 'outline';
  size?: 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}
export function Button({
  className,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  icon,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary',
    success:
    'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary',
    danger: 'bg-danger text-white hover:bg-red-700 focus-visible:ring-danger',
    ghost:
    'bg-transparent text-ink-primary hover:bg-muted focus-visible:ring-primary',
    outline:
    'bg-transparent border-2 border-border text-ink-primary hover:border-primary hover:text-primary focus-visible:ring-primary'
  };
  const sizes = {
    md: 'py-3 px-6 text-lg rounded-xl',
    lg: 'py-4 px-8 text-xl rounded-2xl',
    xl: 'py-6 px-10 text-2xl rounded-2xl'
  };
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}>
      
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>);

}