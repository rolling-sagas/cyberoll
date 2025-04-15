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

export default function DropdownWrap({ triggerChildren, columns }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        {triggerChildren}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="rounded-2xl p-2 w-56">
        {columns.map((column, i) => (
          <DropdownMenuItem
            key={i}
            className="h-11 rounded-xl px-3 text-base font-semibold"
          >
            <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
              {column}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
