'use client';

import PinnedColumns from '@/components/columns/pinned-columns';
import Column from '@/components/column/column';
import { useColumnsStore } from '@/components/columns/pinned-columns';

import { useState, useEffect } from 'react';

import PublicStories from '@/components/columns/stories/public-stories';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import SessionList from '@/components/columns/sessions/session-list';

export default function Page() {
  const reset = useColumnsStore((state) => state.reset);
  const [cur, setCur] = useState('Discover');

  useEffect(() => reset(), []);
  return (
    <PinnedColumns>
      <Column
        headerCenter={
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
              <div className="flex justify-center items-center gap-3">
                {cur}
                <CircleIconButton
                  className="h-6 w-6"
                  icon={<ArrowDown01Icon size={18} />}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="rounded-2xl p-2 w-56"
            >
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base font-semibold"
                onClick={() => setCur('Discover')}
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                  Discover
                  {cur === 'Discover' ? <Tick02Icon size={20} /> : null}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base font-semibold"
                onClick={() => setCur('Recently Played')}
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                  Recently Played
                  {cur === 'Recently Played' ? <Tick02Icon size={20} /> : null}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        {cur === 'Discover' ? <PublicStories /> : <SessionList />}
      </Column>
    </PinnedColumns>
  );
}
