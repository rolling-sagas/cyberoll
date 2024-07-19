"use client";

import { useThemeStore } from "@/components/tailwind/store";
import Column from "@/components/column/column";

export default function Page() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <div className="flex flex-row justify-center">
      <Column headerCenter={<div>Column One</div>}>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
        <p>Hello, World</p>
      </Column>
    </div>
  );
}
