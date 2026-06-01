import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('flex flex-col gap-2', fullWidth ? 'w-full' : '')}>
        {label &&
        <label
          htmlFor={inputId}
          className="text-lg font-medium text-ink-primary">
          
            {label}
          </label>
        }
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-16 px-5 text-xl rounded-xl border-2 border-border bg-white text-ink-primary placeholder:text-ink-secondary/60',
            'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          {...props} />
        
        {error &&
        <span className="text-danger text-sm font-medium">{error}</span>
        }
      </div>);

  }
);
Input.displayName = 'Input';