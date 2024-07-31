import { Fragment } from "react";

import { usePinStore } from "@/components/columns/pinned-columns";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Button,
} from "@headlessui/react";
import { PinIcon, PinOffIcon } from "@hugeicons/react";

const items = [
  { label: "Prompts", id: "prompts" },
  { label: "Occupations", id: "occupations" },
  { label: "Skills", id: "skills" },
];

export default function PinButton() {
  const pin = usePinStore((state) => state.pin);
  const unpin = usePinStore((state) => state.unpin);

  const pinned = usePinStore((state) => state.pinned);

  return (
    <Popover className="relative">
      <PopoverButton className="outline-none">
        <Button as={Fragment}>
          <div
            className="group w-[60px] h-[60px] outline-none
        flex justify-center items-center relative"
          >
            <div
              className="group-data-[hover]:scale-110          
          transition duration-200 h-6 w-6 z-[1] outline-none
          text-neutral-400 group-data-[active]:text-rs-text"
            >
              <PinIcon strokeWidth="2" />
            </div>
            <div
              className="transition absolute w-full h-full rounded-lg
            top-0 left-0 bg-neutral-200/0 scale-50 duration-200 
            group-data-[hover]:scale-100 group-data-[hover]:bg-rs-background-hover"
            />
          </div>
        </Button>
      </PopoverButton>
      <PopoverPanel
        anchor="top start"
        className="flex flex-col bg-rs-background-2 rounded-2xl border
          w-[338px] h-[483px] z-10 origin-bottom-left mt-16 ml-2
          transition duration-200 ease-out
          data-[closed]:scale-75 data-[closed]:opacity-0
          shadow-[0_10px_20px_0_rgba(0,0,0,0.08)] 
          "
        transition
      >
        {({ close }) => {
          return (
            <>
              <div className="flex items-center font-semibold justify-center h-12">
                Pin to home
              </div>
              <div className="px-2 pb-2 flex flex-col h-full overflow-y-auto">
                {items.map((item, index) => (
                  <button
                    key={index}
                    className="w-full h-[52px] rounded-2xl p-3
            hover:bg-neutral-100 flex flex-row items-center justify-start
            font-semibold group"
                    onClick={() => {
                      if (pinned.includes(item.id)) {
                        unpin(item.id);
                      } else {
                        pin(item.id);
                      }
                      close();
                    }}
                  >
                    <span
                      className={`flex-grow text-left ${item.className || ""}`}
                    >
                      {item.label}
                    </span>
                    <span className="hidden group-hover:flex">
                      {pinned.includes(item.id) ? <PinOffIcon /> : <PinIcon />}
                    </span>
                  </button>
                ))}
              </div>
            </>
          );
        }}
      </PopoverPanel>
    </Popover>
  );
}
