'use client';

import {
  CinnamonRollIcon,
  CrownIcon,
  FavouriteIcon,
  Home02Icon,
  Menu08Icon,
  Search01Icon,
  UserIcon,
  Notebook01Icon,
  PlusSignIcon,
} from '@hugeicons/react';

import Link from 'next/link';

import './navbar.css';
import NavButton from './nav-button';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import PinButton from './pin-button';
import useUserStore from '@/stores/user';
import { onCreateClick } from '../columns/stories/story-action';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const [l1Pathname, setL1Pathname] = useState('');
  const router = useRouter()

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
            <PlusSignIcon
              strokeWidth="2"
              variant="solid"
            />
          </div>
          <div
            className="absolute w-full h-full rounded-lg
              top-0 left-0
              scale-100 bg-rs-background-hover"
          />
        </span>
        {/* <NavButton href="/">
          <Search01Icon strokeWidth={l1Pathname === 'search' ? '3' : '2'} />
        </NavButton>
        <NavButton href="/">
          <FavouriteIcon
            strokeWidth="2"
            variant={l1Pathname === 'search' ? 'solid' : 'stroke'}
          />
        </NavButton> */}
        <NavButton href="/u/_" active={l1Pathname === 'u'}>
          <UserIcon
            strokeWidth="2"
            variant={l1Pathname === 'u' ? 'solid' : 'stroke'}
          />
        </NavButton>
      </div>
      <div className="nav mb-6">
        {/* <PinButton /> */}
        <NavButton href="/plan">
          <CrownIcon
            strokeWidth="2"
            className={subscription?.type === 'free' ? '' : '!text-amber-500'}
            variant="duotone"
          />
        </NavButton>
        <NavButton href="/">
          <Menu08Icon strokeWidth="2" />
        </NavButton>
      </div>
    </div>
  );
}
