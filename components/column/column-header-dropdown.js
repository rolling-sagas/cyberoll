'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/react';

export default function ColumnHeaderDropdown({
  value = '',
  options = [],
  onChange = () => {},
}) {
  const label = options.find((o) => o.value === value)?.label;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none sm:flex hidden" asChild>
          <div className="flex justify-center items-center gap-3">
            {label}
            <CircleIconButton
              className="h-6 w-6"
              icon={<ArrowDown01Icon type="sharp" size={18} />}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="rounded-2xl p-2 w-56">
          {options.map((item) => (
            <DropdownMenuItem
              key={item.label}
              className="h-11 rounded-xl px-3 text-base font-semibold"
              onClick={() => onChange(item.value)}
            >
              <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                {item.label}
                {value === item.value ? <Tick02Icon size={20} /> : null}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Tabs value={value} className="w-full block sm:hidden" onValueChange={onChange}>
        <TabsList className="w-full bg-transparent border-b-1 rounded-none pb-0 gap-4">
          {options.map((item) => (
            <TabsTrigger
              key={item.label}
              className="w-full !bg-transparent border-b-1 data-[state=active]:border-foreground rounded-none !shadow-none mb-[-3px] text-base"
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
}
