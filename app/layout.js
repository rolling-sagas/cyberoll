"use client";
import { useEffect } from "react";
import Head from "next/head";
import NavBar from "@/components/navbar/navbar";

import { useThemeStore, applyTheme } from "@/components/tailwind/store";
import { light, dark } from "@/components/tailwind/themeColors";

import "./global.css";

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
        <div className="flex h-svh relative">
          <NavBar />
          <div className="flex overflow-y-hidden overflow-x-auto px-5 w-full">
            <div className="w-[76px]" />
            <div className="flex flex-row flex-grow h-full gap-3 justify-center">
              {children}
            </div>
            <div className="w-[76px]" />
          </div>
        </div>
      </body>
    </html>
  );
}
