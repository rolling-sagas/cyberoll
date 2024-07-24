import { MoreHorizontalIcon } from "@hugeicons/react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export default function ColumnMenuButton({ items }) {
  return (
    <Popover className="relative">
      <PopoverButton className="outline-none">
        <div
          className="border rounded-full bg-rs-background-2 outline-none
          w-6 h-6 flex justify-center items-center 
          shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] 
          transition duration-200 ease-out hover:scale-110"
        >
          <MoreHorizontalIcon className="w-3 h-3" variant="solid" />
        </div>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom end"
        transition
        className="flex flex-col bg-rs-background-2 p-2 rounded-2xl border
          w-60 mt-2 z-[3] origin-top-right ml-1
          transition duration-200 ease-out
          data-[closed]:scale-75 data-[closed]:opacity-0
          shadow-[0_10px_20px_0_rgba(0,0,0,0.08)] 
          "
      >
        {items.map((item, index) => (
          <button
            key={index}
            className="w-full h-[52px] rounded-2xl p-3
            hover:bg-neutral-100 flex flex-row items-center justify-start
            font-semibold"
            onClick={item.onClick}
          >
            <span className={`flex-grow text-left ${item.className || ""}`}>
              {item.label}
            </span>
            {item.right}
          </button>
        ))}
      </PopoverPanel>
    </Popover>
  );
}
