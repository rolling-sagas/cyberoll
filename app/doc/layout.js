'use client';

import { CinnamonRollIcon } from '@hugeicons/react';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="flex h-svh relative z-10">
      <div className="navbar">
        <Link className="logo" href="/">
          <CinnamonRollIcon strokeWidth="2.5" />
        </Link>
      </div>

      <div className="flex overflow-y-hidden overflow-x-auto w-full">
        <div className="block min-w-[76px]" />
        <div className="flex flex-row flex-grow gap-3 justify-center">
          {children}
        </div>
        <div className="block min-w-[76px]" />
      </div>
    </div>
  );
}
