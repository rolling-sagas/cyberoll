'use client';
export const runtime = 'edge';

import PinnedColumns from '@/components/columns/pinned-columns';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import Column from '@/components/column/column';
import ActivityColumnWrap from '@/components/columns/activity/activity-column-wrap';
import { useColumnsStore } from '@/components/columns/pinned-columns';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/react';
import { useEffect, useState } from 'react';

const ActivityDropdownItems = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Social',
    value: 'social',
  },
  // {
  //   label: 'Subscription',
  //   value: 'subscription',
  // },
];

export default function Page() {
  const reset = useColumnsStore((state) => state.reset);
  const [cur, setCur] = useState(ActivityDropdownItems[0]);

  useEffect(() => reset(), []);

  return (
    <PinnedColumns>
      <Column
        // headerLeft={<Back />}
        headerLeft={null}
        headerCenter={
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
              <div className="flex justify-center items-center gap-3">
                {cur.label}
                <CircleIconButton
                  className="h-6 w-6"
                  icon={<ArrowDown01Icon type="sharp" size={18} />}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="rounded-2xl p-2 w-56"
            >
              {ActivityDropdownItems.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  className="h-11 rounded-xl px-3 text-base font-semibold"
                  onClick={() => setCur(item)}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                    {item.label}
                    {cur.value === item.value ? <Tick02Icon size={20} /> : null}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <ActivityColumnWrap type={cur.value} />
      </Column>
    </PinnedColumns>
  );
}
