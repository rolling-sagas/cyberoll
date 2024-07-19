"use client";
import { useEffect } from "react";

import { useThemeStore, applyTheme } from "@/components/tailwind/store";
import { light, dark } from "@/components/tailwind/themeColors";

import "./global.css";

export default function RootLayout({ children }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (
      theme === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyTheme(dark);
    } else {
      applyTheme(light);
    }
  }, [theme]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
