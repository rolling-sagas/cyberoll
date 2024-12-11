"use client";

import { useEffect } from "react";
import Head from "next/head";
import NavBar from "@/components/navbar/navbar";

import { useThemeStore, applyTheme } from "@/components/tailwind/store";
import { light, dark } from "@/components/tailwind/themeColors";

import { DialogPlaceholder } from "@/components/modal/dialog-placeholder";

import "./global.css";

import { ToastPlaceholder } from "@/components/modal/toast-placeholder";
import { AlertPlaceholder } from "@/components/modal/alert-placeholder";

import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'few secs',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy',
  },
});

export default function RootLayout({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      applyTheme(dark);
    } else {
      applyTheme(light);
    }
  }, [theme]);

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
      </body>
    </html>
  );
}
