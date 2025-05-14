'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import { ArrowDown01Icon, Tick02Icon } from '@hugeicons/react';
import { useSearchParams, useRouter } from 'next/navigation';
const tabMap = {
  discover: 'Discover',
  recently: 'Rencently Played',
};

export default function TypeDropdown() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'discover';
  const router = useRouter();

  const createQueryString = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    return params.toString();
  };

  const changeTab = (tab) => {
    if (tab === 'discover') return router.push('/');
    router.push('/?' + createQueryString(tab));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        <div className="flex justify-center items-center gap-3">
          {tabMap[tab]}
          <CircleIconButton
            className="h-6 w-6"
            icon={<ArrowDown01Icon type="sharp" size={18} />}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="rounded-2xl p-2 w-56">
        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-base font-semibold"
          onClick={() => changeTab('discover')}
        >
          <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
            Discover
            {tab === 'discover' ? <Tick02Icon size={20} /> : null}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-base font-semibold"
          onClick={() => changeTab('recently')}
        >
          <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
            Recently Played
            {tab === 'recently' ? <Tick02Icon size={20} /> : null}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
