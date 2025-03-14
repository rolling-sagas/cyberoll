'use-client';
import { Button } from '@/app/components/ui/button';

export default function ButtonView({ view, onClick }) {
  return (
    <Button
      variant={view.variant || 'outline'}
      onClick={onClick}
      className="action-view rounded-xl min-h-10 whitespace-break-spaces h-auto"
    >
      {view.label}
    </Button>
  );
}
