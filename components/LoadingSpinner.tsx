'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative h-12 w-12">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
      <p className="text-center text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
