import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

export default function PopoverWrap({ triggerChildren, columns }) {
  const [open, setOpen] = useState(false);

  const handleItemClick = (e) => {
    if (e.target.closest('[data-popover-item]')) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{triggerChildren}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-40 p-2"
        onClick={handleItemClick}
      >
        <div className="flex flex-col">
          {columns.map((column, i) => (
            <div key={i} data-popover-item>
              {column}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
