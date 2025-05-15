'use client';

import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { goSso } from '@/utils/index';
import { useEffect } from 'react';

export default function NotLogin() {
  useEffect(() => goSso(), [])
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-lg">
          Ooops! You need login to see this page!
        </AlertTitle>
        <AlertDescription onClick={goSso}>
          Go login&gt;&gt;
        </AlertDescription>
      </Alert>
    </div>
  );
}
