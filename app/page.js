"use client";

import Messages from "@/components/play/messages";
import Prompts from "@/components/play/prompts";

import { usePinStore } from "@/components/play/stores";

export default function Page() {
  const pinned = usePinStore((state) => state.pinned);

  return (
    <>
      <Messages />
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
