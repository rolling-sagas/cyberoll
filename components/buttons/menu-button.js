import { MoreHorizontalIcon } from "@hugeicons/react";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  CloseButton,
} from "@headlessui/react";

export function MenuButtonItem({ left, right, onClick, className }) {
  return (
    <div className="px-2">
      <CloseButton
        className={`w-full h-[52px] rounded-2xl p-3
            hover:bg-rs-background-hover flex flex-row items-center justify-start
            font-semibold  ${className || ""}`}
        onClick={onClick}
      >
        <span className="flex-grow text-left">{left}</span>
        {right}
      </CloseButton>
    </div>
  );
}

export function MenuButtonDivider() {
  return <div className="border-b border-rs-border my-2" />;
}

export function MenuButton({ children }) {
  return (
    <Popover className="relative">
      <PopoverButton
        className="group w-fit h-fit outline-none
            flex justify-center items-center relative"
      >
        <div
          className="transition duration-200 
          h-fit w-fit z-[1] flex items-center justify-center
          text-rs-text-secondary"
        >
          <MoreHorizontalIcon className="w-6 h-6" />
        </div>
        <div
          className={`transition absolute rounded-3xl ease-out
            w-[calc(100%+16px)] h-[calc(100%+16px)]
            hover:bg-rs-background-hover scale-75 duration-200 
            group-data-[hover]:scale-100
            group-data-[hover]:bg-rs-background-hover`}
        />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        transition
        className="flex flex-col bg-rs-background-2 rounded-2xl border
          w-60 origin-top-right z-20 [--anchor-gap:6px]
          transition duration-200 ease-out py-2
          data-[closed]:scale-75 data-[closed]:opacity-0
          shadow-[0_10px_20px_0_rgba(0,0,0,0.08)] 
          "
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
}
