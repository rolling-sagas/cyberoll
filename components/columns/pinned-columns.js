"use client";

import { usePinStore } from "@/components/columns/stores";

import Prompts from "@/components/columns/prompts";

export default function PinnedColumns() {
  const pinned = usePinStore((state) => state.pinned);

  return (
    <>
      {pinned.map((name) => {
        switch (name) {
          case "prompts":
            return <Prompts key={name} />;
          default:
            return null;
        }
      })}
    </>
  );
}
