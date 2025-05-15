'use client'; // Error components must be Client Components

import { Button } from './components/ui/button';
import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-lg">
          Ooops! Something went wrong!
        </AlertTitle>
        <AlertDescription>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
