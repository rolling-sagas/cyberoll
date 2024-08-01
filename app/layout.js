"use client";

import { useEffect } from "react";
import Head from "next/head";
import NavBar from "@/components/navbar/navbar";

import { useThemeStore, applyTheme } from "@/components/tailwind/store";
import { light, dark } from "@/components/tailwind/themeColors";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

import { create } from "zustand";

import "./global.css";

export const useModalStore = create((set) => ({
  content: null,
  isOpen: false,

  open: (content) => set({ content, isOpen: true }),
  close: () => set({ content: null, isOpen: false }),
}));

export default function RootLayout({ children }) {
  const theme = useThemeStore((state) => state.theme);

  const closeModal = useModalStore((state) => state.close);
  const ModalContent = useModalStore((state) => state.content);

  const isOpen = useModalStore((state) => state.isOpen);

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
            <div className="hidden md:flex w-[76px]" />
            <div className="flex flex-row flex-grow h-full gap-3 justify-center">
              {children}
            </div>
            <div className="hidden md:flex w-[76px]" />
          </div>
        </div>
        <Dialog
          open={isOpen}
          transition
          onClose={closeModal}
          className="z-10 transition duration-300
            ease-out data-[closed]:opacity-0 fixed inset-0 
            flex w-screen items-center justify-center p-2"
        >
          <DialogPanel className="z-20">{ModalContent}</DialogPanel>
          <DialogBackdrop className="fixed inset-0 bg-black/70 z-10" />
        </Dialog>
      </body>
    </html>
  );
}
