import { Button } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";

export default function NavButton({ href, children, active }) {
  return (
    <Button as={Fragment}>
      <Link
        href={href}
        data-active={active}
        className="group w-[60px] h-[60px] 
        flex justify-center items-center relative"
      >
        <div
          className="group-data-[hover]:scale-110          
          transition duration-200 h-6 w-6 z-[1] 
          text-neutral-400 group-data-[active]:text-rs-text"
        >
          {children}
        </div>
        <div
          className="transition absolute w-full h-full rounded-lg
            top-0 left-0 bg-neutral-200/0 scale-50 duration-200 
            group-data-[hover]:scale-100 group-data-[hover]:bg-neutral-200/50"
        />
      </Link>
    </Button>
  );
}
