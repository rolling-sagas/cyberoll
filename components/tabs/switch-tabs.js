import { Tab, TabGroup, TabList } from "@headlessui/react";
import { Fragment } from "react";

export default function SwitchTabs({ items, index, onChange }) {
  return (
    <TabGroup as={Fragment} selectedIndex={index} onChange={onChange}>
      <TabList
        className="flex flex-row items-center justify-between
        rounded-xl w-fit bg-rs-background-1 relative"
      >
        {items.map((item, index) => (
          <Tab
            key={index}
            className="w-[96px] h-[44px] flex justify-center items-center
            data-[selected]:text-rs-text-primary text-rs-text-secondary z-10"
          >
            {item}
          </Tab>
        ))}
        <span
          className="absolute border w-[96px] h-[44px] ease-out duration-300
            rounded-xl bg-rs-background-3 z-0 transition"
          style={{ transform: `translate(${index * 96}px, 0)` }}
        />
      </TabList>
    </TabGroup>
  );
}
