'use client';

import { cn } from '@/app/lib/utils';
import { Input } from '@/components/ui/input';

export function IconInput({ icon, className, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <Input
        className={cn(
          icon && 'pl-10',
          'focus-visible:ring-1 focus-visible:ring-muted-foreground/10',
          'border-radius-lg',
          className
        )}
        {...props}
      />
    </div>
  );
}
