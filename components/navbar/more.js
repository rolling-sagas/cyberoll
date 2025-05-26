'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { docs } from '@/components/doc/help/setting-docs';
import DropdownDeleteSelfAccountItem from '@/components/dropdown/dropdown-delete-self-account-item/index';
import useUserStore from '@/stores/user';
import { goSso } from '@/utils/index';
import { LinkSquare01Icon, Menu08Icon } from '@hugeicons/react';
import Link from 'next/link';
import HoverButton from './hover-button';
import { onLoginOut } from './login-out-action';
import { onReportProblem } from './report-problem-action';

export default function More({ className = '' }) {
  const userInfo = useUserStore((state) => state.userInfo);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`outline-none ${className}`}>
        <HoverButton className="ml-4 sm:ml-0">
          <Menu08Icon strokeWidth="2" />
        </HoverButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="right"
        sideOffset={0}
        className="rounded-2xl p-2 w-70"
      >
        {userInfo?.id && (
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="h-11 rounded-xl px-3 text-base font-semibold text-rs-text-primary">
                Settings
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                sideOffset={16}
                className="rounded-2xl p-2 w-70"
              >
                <DropdownDeleteSelfAccountItem />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        )}
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-11 rounded-xl px-3 text-base font-semibold text-rs-text-primary">
              Help
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={16}
              className="rounded-2xl p-2 w-70"
            >
              {docs.map((d) => (
                <DropdownMenuItem
                  key={d.key}
                  className="h-11 rounded-xl px-3 text-base text-rs-text-primary"
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer">
                    <Link href={d.url} target="_blank">
                      {d.title}
                    </Link>
                    <LinkSquare01Icon size={20} className="mt-[1px]" />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="h-11 rounded-xl px-3 text-base font-semibold"
          onClick={() => onReportProblem({ type: 'app' })}
        >
          <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-rs-text-primary">
            Report a problem
          </div>
        </DropdownMenuItem>
        {userInfo?.id ? (
          <DropdownMenuItem
            className="h-11 rounded-xl px-3 text-base font-semibold"
            onClick={onLoginOut}
          >
            <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
              Sign out
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="h-11 rounded-xl px-3 text-base font-semibold"
            onClick={() => goSso()}
          >
            <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
              Sign in
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
