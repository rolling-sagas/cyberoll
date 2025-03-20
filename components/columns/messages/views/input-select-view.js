'use-client';
import { Button } from '@/app/components/ui/button';

export default function InputSelectView({ view, onClick }) {
  return (
    <div className="action-view">
      {view.label ? <div className="mb-4">{view.label}</div> : null}
      <div className="flex flex-col gap-4">
        {view.options?.map((opt, idx) => (
          <Button
            variant="outline"
            key={idx}
            onClick={() => onClick(opt)}
            className="rounded-xl min-h-10 max-w-full block whitespace-break-spaces h-auto text-left"
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}
