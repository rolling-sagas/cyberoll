'use client';

import {
  CinnamonRollIcon,
  CrownIcon,
  Home02Icon,
  LinkSquare01Icon,
  Menu08Icon,
  Notebook01Icon,
  PlusSignIcon,
  UserIcon,
} from '@hugeicons/react';

import Link from 'next/link';

import { docs } from '@/app/doc/[key]/page';
import HoverButton from './hover-button';
import NavButton from './nav-button';
import './navbar.css';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
import useUserStore from '@/stores/user';
import { useRouter } from 'next/navigation';
import { onCreateClick } from '../columns/stories/story-action';
import ActivityIcon from './activity-icon';
import { onLoginOut } from './login-out-action';
import { onReportProblem } from './report-problem-action';

export default function NavBar() {
  const pathname = usePathname();
  const [l1Pathname, setL1Pathname] = useState('');
  const router = useRouter();

  const subscription = useUserStore((state) => state.subscription);

  useEffect(() => {
    const match = pathname.match(/\/([^/]+)/) || [];
    setL1Pathname(match[1] || '');
  }, [pathname]);

  return (
    <div className="navbar">
      <Link className="logo" href="/">
        <CinnamonRollIcon strokeWidth="2.5" />
      </Link>
      <div className="nav flex-1">
        <NavButton href="/" active={l1Pathname === ''}>
          <Home02Icon
            strokeWidth="2"
            variant={l1Pathname === '' ? 'solid' : 'stroke'}
          />
        </NavButton>
        <NavButton href="/st" active={l1Pathname === 'st'}>
          <Notebook01Icon
            strokeWidth="2"
            variant={l1Pathname === 'st' ? 'solid' : 'stroke'}
          />
        </NavButton>
        <span
          className="group w-[60px] h-[60px] 
          flex justify-center items-center relative cursor-pointer"
          onClick={() => onCreateClick(null, router)}
        >
          <div
            className="group-hover:scale-110          
            transition duration-200 h-6 w-6 z-[1] 
            text-rs-text-secondary group-active:text-rs-text-primary"
          >
            <PlusSignIcon strokeWidth="2" variant="solid" />
          </div>
          <div
            className="absolute w-full h-full rounded-lg
              top-0 left-0
              scale-100 bg-rs-background-hover"
          />
        </span>
        <NavButton href="/a" active={l1Pathname === 'a'}>
          <ActivityIcon l1Pathname={l1Pathname} />
        </NavButton>
        <NavButton href="/u/_" active={l1Pathname === 'u'}>
          <UserIcon
            strokeWidth="2"
            variant={l1Pathname === 'u' ? 'solid' : 'stroke'}
          />
        </NavButton>
      </div>
      <div className="nav mb-6">
        <NavButton href={subscription?.type === 'free' ? '/pricing' : '/plan'}>
          <CrownIcon
            strokeWidth="2"
            className={subscription?.type === 'free' ? '' : '!text-amber-500'}
            variant="duotone"
          />
        </NavButton>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <HoverButton>
              <Menu08Icon strokeWidth="2" />
            </HoverButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="right"
            sideOffset={0}
            className="rounded-2xl p-2 w-70"
          >
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
                        <Link href={`/doc/${d.key}`}>{d.title}</Link>
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
            <DropdownMenuItem
              className="h-11 rounded-xl px-3 text-base font-semibold"
              onClick={onLoginOut}
            >
              <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
                Sign out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
