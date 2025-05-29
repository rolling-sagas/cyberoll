'use client';

import {
  CrownIcon,
  Home02Icon,
  Notebook01Icon,
  PlusSignIcon,
  Search01Icon,
  UserIcon,
} from '@hugeicons/react';

import Logo from './logo';
import NavButton from './nav-button';
import './navbar.css';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import More from './more';

import { featureCtrl } from '@/stores/ctrl';
import useUserStore from '@/stores/user';
import { goSso } from '@/utils/index';
import { useRouter } from 'next/navigation';
import { onCreateClick } from '../columns/stories/story-action';
import ActivityIcon from './activity-icon';

export default function NavBar() {
  const pathname = usePathname();
  const [l1Pathname, setL1Pathname] = useState('');
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);

  const subscription = useUserStore((state) => state.subscription);

  const createNewStory = (cb, r) => {
    if (!userInfo?.id) {
      goSso();
      return;
    }
    onCreateClick(cb, r);
  };

  useEffect(() => {
    const match = pathname.match(/\/([^/]+)/) || [];
    setL1Pathname(match[1] || '');
  }, [pathname]);

  return (
    <div className="navbar">
      <Logo className="sm:block hidden" />
      <div className="nav flex-1">
        <NavButton href="/" active={l1Pathname === ''}>
          <Home02Icon
            strokeWidth="2"
            variant={l1Pathname === '' ? 'solid' : 'stroke'}
          />
        </NavButton>
        <NavButton href="/srch" active={l1Pathname === 'srch'}>
          <Search01Icon
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
          className="group sm:w-[60px] sm:h-[60px] w-10 h-10
          flex justify-center items-center relative cursor-pointer"
          onClick={() => createNewStory(null, router)}
        >
          <div
            className="group-hover:scale-110          
            transition duration-200 w-6 h-6 z-[1] 
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
      <div
        className={`nav sm:mb-6 ${
          featureCtrl.enablePricing ? '' : '!hidden sm:!flex'
        }`}
      >
        {featureCtrl.enablePricing && (
          <NavButton
            href={subscription?.type === 'free' ? '/pricing' : '/plan'}
          >
            <CrownIcon
              strokeWidth="2"
              className={subscription?.type === 'free' ? '' : '!text-amber-500'}
              variant="duotone"
            />
          </NavButton>
        )}
        <More className="sm:block hidden" />
      </div>
    </div>
  );
}
