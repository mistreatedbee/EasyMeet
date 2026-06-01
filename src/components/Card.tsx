import React from 'react';
import { cn } from '../utils/cn';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
export function Card({
  className,
  padding = 'md',
  children,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10'
  };
  return (
    <div
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-border overflow-hidden',
        paddings[padding],
        className
      )}
      {...props}>
      
      {children}
    </div>);

}