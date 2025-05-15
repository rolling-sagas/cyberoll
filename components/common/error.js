import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Error({ error }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle className="text-lg">
          Ooops! Something went wrong!
        </AlertTitle>
        <AlertDescription>
          {String(error)}
        </AlertDescription>
      </Alert>
    </div>
  );
}
