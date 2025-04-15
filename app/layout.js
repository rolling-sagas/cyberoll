'use client';

import { useEffect, Suspense } from 'react';
import Head from 'next/head';
import NavBar from '@/components/navbar/navbar';

import { useThemeStore, applyTheme } from '@/components/tailwind/store';
import { light, dark } from '@/components/tailwind/themeColors';

import { DialogPlaceholder } from '@/components/modal/dialog-placeholder';

import './global.css';

import { ToastPlaceholder } from '@/components/modal/toast-placeholder';
import { AlertPlaceholder } from '@/components/modal/alert-placeholder';
import SubscriptionCheck from '@/components/common/subscription-check';
import useUserStore from '@/stores/user';
// import Router from 'next/router';
// import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const theme = useThemeStore((state) => state.theme);
  const userStore = useUserStore();

  useEffect(() => {
    if (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      // applyTheme(dark);
      // 暂时先强制 light ~ 后续做darkmod
      applyTheme(light);
    } else {
      applyTheme(light);
    }
  }, [theme]);

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     console.log(111, url);
  //   };

  //   Router.events.on('routeChangeStart', handleRouteChange);
  //   return () => {
  //     Router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, []);

  // const pathname = usePathname()
  // useEffect(() => console.log(222, pathname), [pathname])

  useEffect(() => {
    userStore.getUserInfo();
  }, []);

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Rolling Sagas Playground</title>
      </Head>
      <body suppressHydrationWarning={true}>
        <div className="flex h-svh relative z-10">
          <NavBar />
          <div className="flex overflow-y-hidden overflow-x-auto px-5 w-full">
            <div className="block min-w-[76px]" />
            <div className="flex flex-row flex-grow gap-3 justify-center">
              {children}
            </div>
            <div className="block min-w-[76px]" />
          </div>
        </div>
        <ToastPlaceholder />
        <DialogPlaceholder />
        <AlertPlaceholder />
        <Suspense fallback={null}>
          <SubscriptionCheck />
        </Suspense>
      </body>
    </html>
  );
}
