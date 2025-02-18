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
} from '@hugeicons/react';

import Link from 'next/link';

import './navbar.css';
import NavButton from './nav-button';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import PinButton from './pin-button';
import useUserStore from '@/stores/user';

export default function NavBar() {
  const pathname = usePathname();
  const [l1Pathname, setL1Pathname] = useState('');

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
        <NavButton href="/">
          <Search01Icon strokeWidth={l1Pathname === 'search' ? '3' : '2'} />
        </NavButton>
        <NavButton href="/">
          <FavouriteIcon
            strokeWidth="2"
            variant={l1Pathname === 'search' ? 'solid' : 'stroke'}
          />
        </NavButton>
        <NavButton href="/u/_" active={l1Pathname === 'u'}>
          <UserIcon
            strokeWidth="2"
            variant={l1Pathname === 'u' ? 'solid' : 'stroke'}
          />
        </NavButton>
      </div>
      <div className="nav mb-6">
        <PinButton />
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
